import html2canvas from 'html2canvas';

declare global {
  interface Window {
    glassControls?: {
      blurRadius?: number;
      edgeIntensity?: number;
      rimIntensity?: number;
      baseIntensity?: number;
      edgeDistance?: number;
      rimDistance?: number;
      baseDistance?: number;
      cornerBoost?: number;
      rippleEffect?: number;
      tintOpacity?: number;
    };
  }
}

export interface ContainerOptions {
  borderRadius?: number;
  type?: 'rounded' | 'circle' | 'pill';
  tintOpacity?: number;
}

export class Container {
  static instances: Container[] = [];
  static pageSnapshot: HTMLCanvasElement | null = null;
  static isCapturing = false;
  static waitingForSnapshot: Container[] = [];

  width = 0;
  height = 0;
  borderRadius: number;
  type: 'rounded' | 'circle' | 'pill';
  tintOpacity: number;
  warp = false;

  canvas!: HTMLCanvasElement;
  element!: HTMLDivElement;
  gl: WebGLRenderingContext | null = null;
  gl_refs: any = {};
  webglInitialized = false;
  children: Container[] = [];
  parent: Container | null = null;
  render?: () => void;

  constructor(options: ContainerOptions = {}) {
    this.borderRadius = options.borderRadius || 48;
    this.type = options.type || 'rounded';
    this.tintOpacity = options.tintOpacity !== undefined ? options.tintOpacity : 0.2;

    Container.instances.push(this);
    this.init();
  }

  addChild(child: Container) {
    this.children.push(child);
    child.parent = this;

    if (child.element && this.element) {
      this.element.appendChild(child.element);
    }

    if (child instanceof Button) {
      child.setupAsNestedGlass();
    }

    this.updateSizeFromDOM();
    return child;
  }

  removeChild(child: Container) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;

      if (child.element && this.element.contains(child.element)) {
        this.element.removeChild(child.element);
      }

      this.updateSizeFromDOM();
    }
  }

  updateSizeFromDOM() {
    requestAnimationFrame(() => {
      if (!this.element || !this.canvas) return;
      const rect = this.element.getBoundingClientRect();
      let newWidth = Math.ceil(rect.width);
      let newHeight = Math.ceil(rect.height);

      if (this.type === 'circle') {
        const size = Math.max(newWidth, newHeight);
        newWidth = size;
        newHeight = size;
        this.borderRadius = size / 2;

        this.element.style.width = size + 'px';
        this.element.style.height = size + 'px';
        this.element.style.borderRadius = this.borderRadius + 'px';
      } else if (this.type === 'pill') {
        this.borderRadius = newHeight / 2;
        this.element.style.borderRadius = this.borderRadius + 'px';
      }

      if (newWidth !== this.width || newHeight !== this.height) {
        this.width = newWidth;
        this.height = newHeight;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
        this.canvas.style.borderRadius = this.borderRadius + 'px';

        if (this.gl_refs.gl) {
          const gl = this.gl_refs.gl;
          gl.viewport(0, 0, newWidth, newHeight);
          gl.uniform2f(this.gl_refs.resolutionLoc, newWidth, newHeight);
          gl.uniform1f(this.gl_refs.borderRadiusLoc, this.borderRadius);
        }

        this.children.forEach(child => {
          if (child instanceof Button && child.isNestedGlass && child.gl_refs.gl) {
            const gl = child.gl_refs.gl;
            gl.bindTexture(gl.TEXTURE_2D, child.gl_refs.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            gl.uniform2f(child.gl_refs.textureSizeLoc, newWidth, newHeight);
            if (child.gl_refs.containerSizeLoc) {
              gl.uniform2f(child.gl_refs.containerSizeLoc, newWidth, newHeight);
            }
          }
        });
      }
    });
  }

  init() {
    this.createElement();
    this.setupCanvas();
    this.updateSizeFromDOM();

    if (Container.pageSnapshot) {
      this.initWebGL();
    } else if (Container.isCapturing) {
      Container.waitingForSnapshot.push(this);
    } else {
      Container.isCapturing = true;
      Container.waitingForSnapshot.push(this);
      this.capturePageSnapshot();
    }
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'glass-container';

    if (this.type === 'circle') {
      this.element.classList.add('glass-container-circle');
    } else if (this.type === 'pill') {
      this.element.classList.add('glass-container-pill');
    }

    this.element.style.borderRadius = this.borderRadius + 'px';

    this.canvas = document.createElement('canvas');
    this.canvas.style.borderRadius = this.borderRadius + 'px';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
    this.canvas.style.zIndex = '-1';

    this.element.appendChild(this.canvas);
  }

  setupCanvas() {
    this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!this.gl) {
      console.error('WebGL not supported');
    }
  }

  getPosition() {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  capturePageSnapshot() {
    console.log('Capturing page snapshot...');
    html2canvas(document.body, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      ignoreElements: (element) => {
        return (
          element.classList.contains('glass-container') ||
          element.classList.contains('glass-button') ||
          element.classList.contains('glass-button-text')
        );
      }
    })
      .then(snapshot => {
        console.log('Page snapshot captured');
        Container.pageSnapshot = snapshot;
        Container.isCapturing = false;

        const waitingContainers = Container.waitingForSnapshot.slice();
        Container.waitingForSnapshot = [];

        waitingContainers.forEach(container => {
          if (!container.webglInitialized) {
            container.initWebGL();
          }
        });
      })
      .catch(error => {
        console.error('html2canvas error:', error);
        Container.isCapturing = false;
        Container.waitingForSnapshot = [];
      });
  }

  initWebGL() {
    if (!Container.pageSnapshot || !this.gl) return;

    const img = new Image();
    img.src = Container.pageSnapshot.toDataURL();
    img.onload = () => {
      this.setupShader(img);
      this.webglInitialized = true;
    };
  }

  setupShader(image: HTMLImageElement) {
    const gl = this.gl!;

    const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texcoord;
    varying vec2 v_texcoord;

    void main() {
      gl_Position = vec4(a_position, 0, 1);
      v_texcoord = a_texcoord;
    }
  `;

    const fsSource = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_textureSize;
    uniform float u_scrollY;
    uniform float u_pageHeight;
    uniform float u_viewportHeight;
    uniform float u_blurRadius;
    uniform float u_borderRadius;
    uniform vec2 u_containerPosition;
    uniform float u_warp;
    uniform float u_edgeIntensity;
    uniform float u_rimIntensity;
    uniform float u_baseIntensity;
    uniform float u_edgeDistance;
    uniform float u_rimDistance;
    uniform float u_baseDistance;
    uniform float u_cornerBoost;
    uniform float u_rippleEffect;
    uniform float u_tintOpacity;
    varying vec2 v_texcoord;

    float roundedRectDistance(vec2 coord, vec2 size, float radius) {
      vec2 center = size * 0.5;
      vec2 pixelCoord = coord * size;
      vec2 toCorner = abs(pixelCoord - center) - (center - radius);
      float outsideCorner = length(max(toCorner, 0.0));
      float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
      return (outsideCorner + insideCorner - radius);
    }
    
    float circleDistance(vec2 coord, vec2 size, float radius) {
      vec2 center = vec2(0.5, 0.5);
      vec2 pixelCoord = coord * size;
      vec2 centerPixel = center * size;
      float distFromCenter = length(pixelCoord - centerPixel);
      return distFromCenter - radius;
    }
    
    bool isPill(vec2 size, float radius) {
      float heightRatioDiff = abs(radius - size.y * 0.5);
      bool radiusMatchesHeight = heightRatioDiff < 2.0;
      bool isWiderThanTall = size.x > size.y + 4.0;
      return radiusMatchesHeight && isWiderThanTall;
    }
    
    bool isCircle(vec2 size, float radius) {
      float minDim = min(size.x, size.y);
      bool radiusMatchesMinDim = abs(radius - minDim * 0.5) < 1.0;
      bool isRoughlySquare = abs(size.x - size.y) < 4.0;
      return radiusMatchesMinDim && isRoughlySquare;
    }
    
    float pillDistance(vec2 coord, vec2 size, float radius) {
      vec2 center = size * 0.5;
      vec2 pixelCoord = coord * size;
      vec2 capsuleStart = vec2(radius, center.y);
      vec2 capsuleEnd = vec2(size.x - radius, center.y);
      vec2 capsuleAxis = capsuleEnd - capsuleStart;
      float capsuleLength = length(capsuleAxis);
      
      if (capsuleLength > 0.0) {
        vec2 toPoint = pixelCoord - capsuleStart;
        float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
        vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
        return length(pixelCoord - closestPointOnAxis) - radius;
      } else {
        return length(pixelCoord - center) - radius;
      }
    }

    void main() {
      vec2 coord = v_texcoord;
      float scrollY = u_scrollY;
      vec2 containerSize = u_resolution;
      vec2 textureSize = u_textureSize;
      vec2 containerCenter = u_containerPosition + vec2(0.0, scrollY);
      vec2 containerOffset = (coord - 0.5) * containerSize;
      vec2 pagePixel = containerCenter + containerOffset;
      vec2 textureCoord = pagePixel / textureSize;
      
      float distFromEdgeShape;
      vec2 shapeNormal;
      
      if (isPill(u_resolution, u_borderRadius)) {
        distFromEdgeShape = -pillDistance(coord, u_resolution, u_borderRadius);
        vec2 center = vec2(0.5, 0.5);
        vec2 pixelCoord = coord * u_resolution;
        vec2 capsuleStart = vec2(u_borderRadius, center.y * u_resolution.y);
        vec2 capsuleEnd = vec2(u_resolution.x - u_borderRadius, center.y * u_resolution.y);
        vec2 capsuleAxis = capsuleEnd - capsuleStart;
        float capsuleLength = length(capsuleAxis);
        
        if (capsuleLength > 0.0) {
          vec2 toPoint = pixelCoord - capsuleStart;
          float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
          vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
          vec2 normalDir = pixelCoord - closestPointOnAxis;
          shapeNormal = length(normalDir) > 0.0 ? normalize(normalDir) : vec2(0.0, 1.0);
        } else {
          shapeNormal = normalize(coord - center);
        }
      } else if (isCircle(u_resolution, u_borderRadius)) {
        distFromEdgeShape = -circleDistance(coord, u_resolution, u_borderRadius);
        vec2 center = vec2(0.5, 0.5);
        shapeNormal = normalize(coord - center);
      } else {
        distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
        vec2 center = vec2(0.5, 0.5);
        shapeNormal = normalize(coord - center);
      }
      distFromEdgeShape = max(distFromEdgeShape, 0.0);
      
      float distFromLeft = coord.x;
      float distFromRight = 1.0 - coord.x;
      float distFromTop = coord.y;
      float distFromBottom = 1.0 - coord.y;
      float distFromEdge = distFromEdgeShape / min(u_resolution.x, u_resolution.y);
      
      float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);
      float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
      float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
      float rimIntensity = exp(-normalizedDistance * u_rimDistance);
      
      float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
      float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;
      
      vec2 baseRefraction = shapeNormal * totalIntensity;
      
      float cornerProximityX = min(distFromLeft, distFromRight);
      float cornerProximityY = min(distFromTop, distFromBottom);
      float cornerDistance = max(cornerProximityX, cornerProximityY);
      float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);
      
      float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
      vec2 cornerRefraction = shapeNormal * cornerBoost;
      
      vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
      float rippleEffect = sin(distFromEdge * 25.0) * u_rippleEffect * rimIntensity;
      vec2 textureRefraction = perpendicular * rippleEffect;
      
      vec2 totalRefraction = baseRefraction + cornerRefraction + textureRefraction;
      textureCoord += totalRefraction;
      
      vec4 color = vec4(0.0);
      vec2 texelSize = 1.0 / u_textureSize;
      float sigma = u_blurRadius / 2.0;
      vec2 blurStep = texelSize * sigma;
      
      float totalWeight = 0.0;
      
      for(float i = -6.0; i <= 6.0; i += 1.0) {
        for(float j = -6.0; j <= 6.0; j += 1.0) {
          float distance = length(vec2(i, j));
          if(distance > 6.0) continue;
          
          float weight = exp(-(distance * distance) / (2.0 * sigma * sigma));
          vec2 offset = vec2(i, j) * blurStep;
          color += texture2D(u_image, textureCoord + offset) * weight;
          totalWeight += weight;
        }
      }
      
      color /= totalWeight;
      
      float gradientPosition = coord.y;
      vec3 topTint = vec3(1.0, 1.0, 1.0);
      vec3 bottomTint = vec3(0.7, 0.7, 0.7);
      vec3 gradientTint = mix(topTint, bottomTint, gradientPosition);
      vec3 tintedColor = mix(color.rgb, gradientTint, u_tintOpacity);
      color = vec4(tintedColor, color.a);
      
      vec2 viewportCenter = containerCenter;
      float topY = (viewportCenter.y - containerSize.y * 0.4) / textureSize.y;
      float midY = viewportCenter.y / textureSize.y;
      float bottomY = (viewportCenter.y + containerSize.y * 0.4) / textureSize.y;
      
      vec3 topColor = vec3(0.0);
      vec3 midColor = vec3(0.0);
      vec3 bottomColor = vec3(0.0);
      
      float sampleCount = 0.0;
      for(float x = 0.0; x < 1.0; x += 0.05) {
        for(float yOffset = -5.0; yOffset <= 5.0; yOffset += 1.0) {
          vec2 topSample = vec2(x, topY + yOffset * texelSize.y);
          vec2 midSample = vec2(x, midY + yOffset * texelSize.y);
          vec2 bottomSample = vec2(x, bottomY + yOffset * texelSize.y);
          
          topColor += texture2D(u_image, topSample).rgb;
          midColor += texture2D(u_image, midSample).rgb;
          bottomColor += texture2D(u_image, bottomSample).rgb;
          sampleCount += 1.0;
        }
      }
      
      topColor /= sampleCount;
      midColor /= sampleCount;
      bottomColor /= sampleCount;
      
      vec3 sampledGradient;
      if (gradientPosition < 0.1) {
        sampledGradient = topColor;
      } else if (gradientPosition > 0.9) {
        sampledGradient = bottomColor;
      } else {
        float transitionPos = (gradientPosition - 0.1) / 0.8;
        if (transitionPos < 0.5) {
          float t = transitionPos * 2.0;
          sampledGradient = mix(topColor, midColor, t);
        } else {
          float t = (transitionPos - 0.5) * 2.0;
          sampledGradient = mix(midColor, bottomColor, t);
        }
      }
      
      vec3 finalTinted = mix(color.rgb, sampledGradient, u_tintOpacity * 0.3);
      color = vec4(finalTinted, color.a);
      
      float maskDistance;
      if (isPill(u_resolution, u_borderRadius)) {
        maskDistance = pillDistance(coord, u_resolution, u_borderRadius);
      } else if (isCircle(u_resolution, u_borderRadius)) {
        maskDistance = circleDistance(coord, u_resolution, u_borderRadius);
      } else {
        maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
      }
      float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);
      
      gl_FragColor = vec4(color.rgb, mask);
    }
    `;

    const program = this.createProgram(gl, vsSource, fsSource);
    if (!program) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const texcoordLoc = gl.getAttribLocation(program, 'a_texcoord');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const textureSizeLoc = gl.getUniformLocation(program, 'u_textureSize');
    const scrollYLoc = gl.getUniformLocation(program, 'u_scrollY');
    const pageHeightLoc = gl.getUniformLocation(program, 'u_pageHeight');
    const viewportHeightLoc = gl.getUniformLocation(program, 'u_viewportHeight');
    const blurRadiusLoc = gl.getUniformLocation(program, 'u_blurRadius');
    const borderRadiusLoc = gl.getUniformLocation(program, 'u_borderRadius');
    const containerPositionLoc = gl.getUniformLocation(program, 'u_containerPosition');
    const warpLoc = gl.getUniformLocation(program, 'u_warp');
    const edgeIntensityLoc = gl.getUniformLocation(program, 'u_edgeIntensity');
    const rimIntensityLoc = gl.getUniformLocation(program, 'u_rimIntensity');
    const baseIntensityLoc = gl.getUniformLocation(program, 'u_baseIntensity');
    const edgeDistanceLoc = gl.getUniformLocation(program, 'u_edgeDistance');
    const rimDistanceLoc = gl.getUniformLocation(program, 'u_rimDistance');
    const baseDistanceLoc = gl.getUniformLocation(program, 'u_baseDistance');
    const cornerBoostLoc = gl.getUniformLocation(program, 'u_cornerBoost');
    const rippleEffectLoc = gl.getUniformLocation(program, 'u_rippleEffect');
    const tintOpacityLoc = gl.getUniformLocation(program, 'u_tintOpacity');
    const imageLoc = gl.getUniformLocation(program, 'u_image');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.gl_refs = {
      gl,
      texture,
      textureSizeLoc,
      scrollYLoc,
      positionLoc,
      texcoordLoc,
      resolutionLoc,
      pageHeightLoc,
      viewportHeightLoc,
      blurRadiusLoc,
      borderRadiusLoc,
      containerPositionLoc,
      warpLoc,
      edgeIntensityLoc,
      rimIntensityLoc,
      baseIntensityLoc,
      edgeDistanceLoc,
      rimDistanceLoc,
      baseDistanceLoc,
      cornerBoostLoc,
      rippleEffectLoc,
      tintOpacityLoc,
      imageLoc,
      positionBuffer,
      texcoordBuffer
    };

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLoc, this.canvas.width, this.canvas.height);
    gl.uniform2f(textureSizeLoc, image.width, image.height);
    gl.uniform1f(blurRadiusLoc, window.glassControls?.blurRadius || 5.0);
    gl.uniform1f(borderRadiusLoc, this.borderRadius);
    gl.uniform1f(warpLoc, this.warp ? 1.0 : 0.0);
    gl.uniform1f(edgeIntensityLoc, window.glassControls?.edgeIntensity || 0.01);
    gl.uniform1f(rimIntensityLoc, window.glassControls?.rimIntensity || 0.05);
    gl.uniform1f(baseIntensityLoc, window.glassControls?.baseIntensity || 0.01);
    gl.uniform1f(edgeDistanceLoc, window.glassControls?.edgeDistance || 0.15);
    gl.uniform1f(rimDistanceLoc, window.glassControls?.rimDistance || 0.8);
    gl.uniform1f(baseDistanceLoc, window.glassControls?.baseDistance || 0.1);
    gl.uniform1f(cornerBoostLoc, window.glassControls?.cornerBoost || 0.02);
    gl.uniform1f(rippleEffectLoc, window.glassControls?.rippleEffect || 0.1);
    gl.uniform1f(tintOpacityLoc, this.tintOpacity);

    const position = this.getPosition();
    gl.uniform2f(containerPositionLoc, position.x, position.y);

    const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const viewportHeight = window.innerHeight;
    gl.uniform1f(pageHeightLoc, pageHeight);
    gl.uniform1f(viewportHeightLoc, viewportHeight);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(imageLoc, 0);

    this.startRenderLoop();
  }

  startRenderLoop() {
    const render = () => {
      if (!this.gl_refs.gl) return;

      const gl = this.gl_refs.gl;
      gl.clear(gl.COLOR_BUFFER_BIT);

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      gl.uniform1f(this.gl_refs.scrollYLoc, scrollY);

      const position = this.getPosition();
      gl.uniform2f(this.gl_refs.containerPositionLoc, position.x, position.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    const handleScroll = () => render();
    window.addEventListener('scroll', handleScroll, { passive: true });
    this.render = render;
  }

  createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vs = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  compileShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
}

export interface ButtonOptions {
  text?: string;
  size?: number;
  type?: 'rounded' | 'circle' | 'pill';
  onClick?: (text: string) => void;
  warp?: boolean;
  tintOpacity?: number;
}

export class Button extends Container {
  text: string;
  fontSize: number;
  onClick: ((text: string) => void) | null;
  textElement!: HTMLDivElement;
  isNestedGlass = false;

  constructor(options: ButtonOptions = {}) {
    const text = options.text || 'Button';
    const fontSize = options.size || 48;
    const onClick = options.onClick || null;
    const type = options.type || 'rounded';
    const warp = options.warp !== undefined ? options.warp : false;
    const tintOpacity = options.tintOpacity !== undefined ? options.tintOpacity : 0.2;

    super({
      borderRadius: fontSize,
      type: type,
      tintOpacity: tintOpacity
    });

    this.text = text;
    this.fontSize = fontSize;
    this.onClick = onClick;
    this.type = type;
    this.warp = warp;

    this.element.classList.add('glass-button');
    if (this.type === 'circle') {
      this.element.classList.add('glass-button-circle');
    }
    this.createTextElement();
    this.setupClickHandler();
    this.setSizeFromText();
  }

  setSizeFromText() {
    let width: number, height: number;

    if (this.type === 'circle') {
      const circleSize = this.fontSize * 2.5;
      width = circleSize;
      height = circleSize;
      this.borderRadius = circleSize / 2;

      this.element.style.width = width + 'px';
      this.element.style.height = height + 'px';
      this.element.style.minWidth = width + 'px';
      this.element.style.minHeight = height + 'px';
      this.element.style.maxWidth = width + 'px';
      this.element.style.maxHeight = height + 'px';
    } else if (this.type === 'pill') {
      const textMetrics = Button.measureText(this.text, this.fontSize);
      width = Math.ceil(textMetrics.width + this.fontSize * 2);
      height = Math.ceil(this.fontSize + this.fontSize * 1.2);
      this.borderRadius = height / 2;
      this.element.style.minWidth = width + 'px';
      this.element.style.minHeight = height + 'px';
    } else {
      const textMetrics = Button.measureText(this.text, this.fontSize);
      width = Math.ceil(textMetrics.width + this.fontSize * 2);
      height = Math.ceil(this.fontSize + this.fontSize * 1.5);
      this.borderRadius = this.fontSize;
      this.element.style.minWidth = width + 'px';
      this.element.style.minHeight = height + 'px';
    }

    this.element.style.borderRadius = this.borderRadius + 'px';

    if (this.canvas) {
      this.canvas.style.borderRadius = this.borderRadius + 'px';
    }

    if (this.type === 'circle') {
      this.width = width;
      this.height = height;

      if (this.canvas) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        if (this.gl_refs.gl) {
          const gl = this.gl_refs.gl;
          gl.viewport(0, 0, width, height);
          gl.uniform2f(this.gl_refs.resolutionLoc, width, height);
          gl.uniform1f(this.gl_refs.borderRadiusLoc, this.borderRadius);
        }
      }
    } else if (this.type === 'pill') {
      this.width = width;
      this.height = height;

      this.element.style.width = width + 'px';
      this.element.style.height = height + 'px';
      this.element.style.maxWidth = width + 'px';
      this.element.style.maxHeight = height + 'px';

      if (this.canvas) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        if (this.gl_refs.gl) {
          const gl = this.gl_refs.gl;
          gl.viewport(0, 0, width, height);
          gl.uniform2f(this.gl_refs.resolutionLoc, width, height);
          gl.uniform1f(this.gl_refs.borderRadiusLoc, this.borderRadius);
        }
      }
    } else {
      this.updateSizeFromDOM();
    }
  }

  setupAsNestedGlass() {
    if (this.parent && !this.isNestedGlass) {
      this.isNestedGlass = true;
      if (this.webglInitialized) {
        this.initWebGL();
      }
    }
  }

  static measureText(text: string, fontSize: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    return ctx.measureText(text);
  }

  createTextElement() {
    this.textElement = document.createElement('div');
    this.textElement.className = 'glass-button-text';
    this.textElement.textContent = this.text;
    this.textElement.style.fontSize = this.fontSize + 'px';

    this.element.appendChild(this.textElement);
  }

  setupClickHandler() {
    if (this.onClick && this.element) {
      this.element.addEventListener('click', e => {
        e.preventDefault();
        this.onClick!(this.text);
      });
    }
  }

  override initWebGL() {
    if (!Container.pageSnapshot || !this.gl) return;

    if (this.parent && this.isNestedGlass) {
      this.initNestedGlass();
    } else {
      super.initWebGL();
    }
  }

  initNestedGlass() {
    if (!this.parent!.webglInitialized) {
      setTimeout(() => this.initNestedGlass(), 100);
      return;
    }
    this.setupDynamicNestedShader();
    this.webglInitialized = true;
  }

  setupDynamicNestedShader() {
    const gl = this.gl!;

    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texcoord;
      varying vec2 v_texcoord;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texcoord = a_texcoord;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform vec2 u_textureSize;
      uniform float u_blurRadius;
      uniform float u_borderRadius;
      uniform vec2 u_buttonPosition;
      uniform vec2 u_containerPosition;
      uniform vec2 u_containerSize;
      uniform float u_warp;
      uniform float u_edgeIntensity;
      uniform float u_rimIntensity;
      uniform float u_baseIntensity;
      uniform float u_edgeDistance;
      uniform float u_rimDistance;
      uniform float u_baseDistance;
      uniform float u_cornerBoost;
      uniform float u_rippleEffect;
      uniform float u_tintOpacity;
      varying vec2 v_texcoord;

      float roundedRectDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = size * 0.5;
        vec2 pixelCoord = coord * size;
        vec2 toCorner = abs(pixelCoord - center) - (center - radius);
        float outsideCorner = length(max(toCorner, 0.0));
        float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
        return (outsideCorner + insideCorner - radius);
      }
      
      float circleDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = vec2(0.5, 0.5);
        vec2 pixelCoord = coord * size;
        vec2 centerPixel = center * size;
        float distFromCenter = length(pixelCoord - centerPixel);
        return distFromCenter - radius;
      }
      
      bool isPill(vec2 size, float radius) {
        float heightRatioDiff = abs(radius - size.y * 0.5);
        bool radiusMatchesHeight = heightRatioDiff < 2.0;
        bool isWiderThanTall = size.x > size.y + 4.0;
        return radiusMatchesHeight && isWiderThanTall;
      }
      
      bool isCircle(vec2 size, float radius) {
        float minDim = min(size.x, size.y);
        bool radiusMatchesMinDim = abs(radius - minDim * 0.5) < 1.0;
        bool isRoughlySquare = abs(size.x - size.y) < 4.0;
        return radiusMatchesMinDim && isRoughlySquare;
      }
      
      float pillDistance(vec2 coord, vec2 size, float radius) {
        vec2 center = size * 0.5;
        vec2 pixelCoord = coord * size;
        vec2 capsuleStart = vec2(radius, center.y);
        vec2 capsuleEnd = vec2(size.x - radius, center.y);
        vec2 capsuleAxis = capsuleEnd - capsuleStart;
        float capsuleLength = length(capsuleAxis);
        
        if (capsuleLength > 0.0) {
          vec2 toPoint = pixelCoord - capsuleStart;
          float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
          vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
          return length(pixelCoord - closestPointOnAxis) - radius;
        } else {
          return length(pixelCoord - center) - radius;
        }
      }

      void main() {
        vec2 coord = v_texcoord;
        vec2 buttonSize = u_resolution;
        vec2 containerSize = u_containerSize;
        vec2 containerTopLeft = u_containerPosition - containerSize * 0.5;
        vec2 buttonTopLeft = u_buttonPosition - buttonSize * 0.5;
        vec2 buttonRelativePos = buttonTopLeft - containerTopLeft;
        vec2 buttonPixel = coord * buttonSize;
        vec2 containerPixel = buttonRelativePos + buttonPixel;
        vec2 baseTextureCoord = containerPixel / containerSize;
        
        float distFromEdgeShape;
        vec2 shapeNormal;
        
        if (isPill(u_resolution, u_borderRadius)) {
          distFromEdgeShape = -pillDistance(coord, u_resolution, u_borderRadius);
          vec2 center = vec2(0.5, 0.5);
          vec2 pixelCoord = coord * u_resolution;
          vec2 capsuleStart = vec2(u_borderRadius, center.y * u_resolution.y);
          vec2 capsuleEnd = vec2(u_resolution.x - u_borderRadius, center.y * u_resolution.y);
          vec2 capsuleAxis = capsuleEnd - capsuleStart;
          float capsuleLength = length(capsuleAxis);
          
          if (capsuleLength > 0.0) {
            vec2 toPoint = pixelCoord - capsuleStart;
            float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
            vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
            vec2 normalDir = pixelCoord - closestPointOnAxis;
            shapeNormal = length(normalDir) > 0.0 ? normalize(normalDir) : vec2(0.0, 1.0);
          } else {
            shapeNormal = normalize(coord - center);
          }
        } else if (isCircle(u_resolution, u_borderRadius)) {
          distFromEdgeShape = -circleDistance(coord, u_resolution, u_borderRadius);
          vec2 center = vec2(0.5, 0.5);
          shapeNormal = normalize(coord - center);
        } else {
          distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
          vec2 center = vec2(0.5, 0.5);
          shapeNormal = normalize(coord - center);
        }
        distFromEdgeShape = max(distFromEdgeShape, 0.0);
        
        float distFromLeft = coord.x;
        float distFromRight = 1.0 - coord.x;
        float distFromTop = coord.y;
        float distFromBottom = 1.0 - coord.y;
        float distFromEdge = distFromEdgeShape / min(u_resolution.x, u_resolution.y);
        
        float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);
        float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
        float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
        float rimIntensity = exp(-normalizedDistance * u_rimDistance);
        
        float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
        float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;
        
        vec2 baseRefraction = shapeNormal * totalIntensity;
        
        float cornerProximityX = min(distFromLeft, distFromRight);
        float cornerProximityY = min(distFromTop, distFromBottom);
        float cornerDistance = max(cornerProximityX, cornerProximityY);
        float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);
        
        float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
        vec2 cornerRefraction = shapeNormal * cornerBoost;
        
        vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
        float rippleEffect = sin(distFromEdge * 30.0) * u_rippleEffect * rimIntensity;
        vec2 textureRefraction = perpendicular * rippleEffect;
        
        vec2 totalRefraction = baseRefraction + cornerRefraction + textureRefraction;
        vec2 textureCoord = baseTextureCoord + totalRefraction;
        
        vec4 color = vec4(0.0);
        vec2 texelSize = 1.0 / containerSize;
        float sigma = u_blurRadius / 3.0;
        vec2 blurStep = texelSize * sigma;
        
        float totalWeight = 0.0;
        
        for(float i = -4.0; i <= 4.0; i += 1.0) {
          for(float j = -4.0; j <= 4.0; j += 1.0) {
            float distance = length(vec2(i, j));
            if(distance > 4.0) continue;
            
            float weight = exp(-(distance * distance) / (2.0 * sigma * sigma));
            vec2 offset = vec2(i, j) * blurStep;
            color += texture2D(u_image, textureCoord + offset) * weight;
            totalWeight += weight;
          }
        }
        
        color /= totalWeight;
        
        float gradientPosition = coord.y;
        vec3 topTint = vec3(1.0, 1.0, 1.0);
        vec3 bottomTint = vec3(0.7, 0.7, 0.7);
        vec3 gradientTint = mix(topTint, bottomTint, gradientPosition);
        vec3 tintedColor = mix(color.rgb, gradientTint, u_tintOpacity * 0.7);
        color = vec4(tintedColor, color.a);
        
        vec2 viewportCenter = u_buttonPosition;
        float topY = max(0.0, (viewportCenter.y - buttonSize.y * 0.4) / containerSize.y);
        float midY = viewportCenter.y / containerSize.y;
        float bottomY = min(1.0, (viewportCenter.y + buttonSize.y * 0.4) / containerSize.y);
        
        vec3 topColor = texture2D(u_image, vec2(0.5, topY)).rgb;
        vec3 midColor = texture2D(u_image, vec2(0.5, midY)).rgb;
        vec3 bottomColor = texture2D(u_image, vec2(0.5, bottomY)).rgb;
        
        vec3 sampledGradient;
        if (gradientPosition < 0.1) {
          sampledGradient = topColor;
        } else if (gradientPosition > 0.9) {
          sampledGradient = bottomColor;
        } else {
          float transitionPos = (gradientPosition - 0.1) / 0.8;
          if (transitionPos < 0.5) {
            float t = transitionPos * 2.0;
            sampledGradient = mix(topColor, midColor, t);
          } else {
            float t = (transitionPos - 0.5) * 2.0;
            sampledGradient = mix(midColor, bottomColor, t);
          }
        }
        
        vec3 secondTinted = mix(color.rgb, sampledGradient, u_tintOpacity * 0.4);
        
        vec3 buttonTopTint = vec3(1.08, 1.08, 1.08);    
        vec3 buttonBottomTint = vec3(0.92, 0.92, 0.92); 
        vec3 buttonGradient = mix(buttonTopTint, buttonBottomTint, gradientPosition);
        vec3 finalTinted = secondTinted * buttonGradient;
        
        float maskDistance;
        if (isPill(u_resolution, u_borderRadius)) {
          maskDistance = pillDistance(coord, u_resolution, u_borderRadius);
        } else if (isCircle(u_resolution, u_borderRadius)) {
          maskDistance = circleDistance(coord, u_resolution, u_borderRadius);
        } else {
          maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
        }
        float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);
        
        gl_FragColor = vec4(finalTinted, mask);
      }
    `;

    const program = this.createProgram(gl, vsSource, fsSource);
    if (!program) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const texcoordLoc = gl.getAttribLocation(program, 'a_texcoord');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const textureSizeLoc = gl.getUniformLocation(program, 'u_textureSize');
    const blurRadiusLoc = gl.getUniformLocation(program, 'u_blurRadius');
    const borderRadiusLoc = gl.getUniformLocation(program, 'u_borderRadius');
    const buttonPositionLoc = gl.getUniformLocation(program, 'u_buttonPosition');
    const containerPositionLoc = gl.getUniformLocation(program, 'u_containerPosition');
    const containerSizeLoc = gl.getUniformLocation(program, 'u_containerSize');
    const warpLoc = gl.getUniformLocation(program, 'u_warp');
    const edgeIntensityLoc = gl.getUniformLocation(program, 'u_edgeIntensity');
    const rimIntensityLoc = gl.getUniformLocation(program, 'u_rimIntensity');
    const baseIntensityLoc = gl.getUniformLocation(program, 'u_baseIntensity');
    const edgeDistanceLoc = gl.getUniformLocation(program, 'u_edgeDistance');
    const rimDistanceLoc = gl.getUniformLocation(program, 'u_rimDistance');
    const baseDistanceLoc = gl.getUniformLocation(program, 'u_baseDistance');
    const cornerBoostLoc = gl.getUniformLocation(program, 'u_cornerBoost');
    const rippleEffectLoc = gl.getUniformLocation(program, 'u_rippleEffect');
    const tintOpacityLoc = gl.getUniformLocation(program, 'u_tintOpacity');
    const imageLoc = gl.getUniformLocation(program, 'u_image');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const containerCanvas = this.parent!.canvas;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      containerCanvas.width,
      containerCanvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.gl_refs = {
      gl,
      texture,
      textureSizeLoc,
      positionLoc,
      texcoordLoc,
      resolutionLoc,
      blurRadiusLoc,
      borderRadiusLoc,
      buttonPositionLoc,
      containerPositionLoc,
      containerSizeLoc,
      warpLoc,
      edgeIntensityLoc,
      rimIntensityLoc,
      baseIntensityLoc,
      edgeDistanceLoc,
      rimDistanceLoc,
      baseDistanceLoc,
      cornerBoostLoc,
      rippleEffectLoc,
      tintOpacityLoc,
      imageLoc,
      positionBuffer,
      texcoordBuffer
    };

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLoc, this.canvas.width, this.canvas.height);
    gl.uniform2f(textureSizeLoc, containerCanvas.width, containerCanvas.height);
    gl.uniform1f(blurRadiusLoc, window.glassControls?.blurRadius || 2.0);
    gl.uniform1f(borderRadiusLoc, this.borderRadius);
    gl.uniform1f(warpLoc, this.warp ? 1.0 : 0.0);
    gl.uniform1f(edgeIntensityLoc, window.glassControls?.edgeIntensity || 0.01);
    gl.uniform1f(rimIntensityLoc, window.glassControls?.rimIntensity || 0.05);
    gl.uniform1f(baseIntensityLoc, window.glassControls?.baseIntensity || 0.01);
    gl.uniform1f(edgeDistanceLoc, window.glassControls?.edgeDistance || 0.15);
    gl.uniform1f(rimDistanceLoc, window.glassControls?.rimDistance || 0.8);
    gl.uniform1f(baseDistanceLoc, window.glassControls?.baseDistance || 0.1);
    gl.uniform1f(cornerBoostLoc, window.glassControls?.cornerBoost || 0.02);
    gl.uniform1f(rippleEffectLoc, window.glassControls?.rippleEffect || 0.1);
    gl.uniform1f(tintOpacityLoc, this.tintOpacity);

    const buttonPosition = this.getPosition();
    const containerPosition = this.parent!.getPosition();
    gl.uniform2f(buttonPositionLoc, buttonPosition.x, buttonPosition.y);
    gl.uniform2f(containerPositionLoc, containerPosition.x, containerPosition.y);
    gl.uniform2f(containerSizeLoc, this.parent!.width, this.parent!.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(imageLoc, 0);

    this.startNestedRenderLoop();
  }

  startNestedRenderLoop() {
    const render = () => {
      if (!this.gl_refs.gl || !this.parent) return;

      const gl = this.gl_refs.gl;

      const containerCanvas = this.parent.canvas;
      gl.bindTexture(gl.TEXTURE_2D, this.gl_refs.texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, containerCanvas);

      gl.clear(gl.COLOR_BUFFER_BIT);

      const buttonPosition = this.getPosition();
      const containerPosition = this.parent.getPosition();
      gl.uniform2f(this.gl_refs.buttonPositionLoc, buttonPosition.x, buttonPosition.y);
      gl.uniform2f(this.gl_refs.containerPositionLoc, containerPosition.x, containerPosition.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animationLoop = () => {
      render();
      requestAnimationFrame(animationLoop);
    };

    animationLoop();
    this.render = render;
  }
}
