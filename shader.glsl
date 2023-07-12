precision highp float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float time;
uniform vec2 resolution;

struct tree {
  vec2 pos;
  float age;
  float life;
  float height;
  float width;
  int leafCount;
  float leafSize;
  float leafSizeScaling;
  float leafHeightCutoff;
};

struct star {
  vec2 pos;
  float size;
  float timeOffset;
};

vec3 topColorDay = vec3(1, 1, 0.3);
vec3 topColorNight = vec3(0.53, 0.23, 0.46);
vec3 bottomColorDay = vec3(0.27, 0.51, 0.96);
vec3 bottomColorNight = vec3(0.13, 0.04, 0.35);
vec3 groundColorDay = vec3(0, 0, 0);
vec3 groundColorNight = vec3(0, 0, 0);
vec3 starColor = vec3(1, 1, 1);

//Testing trees
tree[4] testTrees = tree[](
  tree(vec2(0.3, 0.15), 0.0, 10.0, 0.5, 0.03, 2, 0.14, 1.8, 0.2),
  tree(vec2(0.6, 0.25), 0.0, 10.0, 0.3, 0.07, 4, 0.18, 1.2, 0.35),
  tree(vec2(0.9, 0.03), 0.0, 10.0, 0.7, 0.065, 7, 0.21, 1.4, 0.45),
  tree(vec2(0.05, 0.05), 0.0, 10.0, 0.45, 0.02, 1, 0.08, 1.8, 0.8)
);

//Testing stars
star[100] testStars = star[](
    star(vec2(0.119, 0.679), 6.0, 4.367),
    star(vec2(0.207, 0.379), 4.0, 1.942),
    star(vec2(0.199, 0.605), 3.0, 3.648),
    star(vec2(0.465, 0.392), 9.0, 4.238),
    star(vec2(0.334, 0.752), 8.0, 1.941),
    star(vec2(0.379, 0.664), 7.0, 3.079),
    star(vec2(0.798, 0.284), 3.0, 2.734),
    star(vec2(0.501, 0.707), 6.0, 4.862),
    star(vec2(0.959, 0.429), 7.0, 1.925),
    star(vec2(0.133, 0.283), 5.0, 4.422),
    star(vec2(0.743, 0.667), 2.0, 2.315),
    star(vec2(0.589, 0.902), 9.0, 0.979),
    star(vec2(0.335, 0.176), 1.0, 4.152),
    star(vec2(0.596, 0.335), 5.0, 2.877),
    star(vec2(0.709, 0.916), 6.0, 4.605),
    star(vec2(0.887, 0.57), 3.0, 1.217),
    star(vec2(0.201, 0.434), 4.0, 0.895),
    star(vec2(0.895, 0.322), 2.0, 3.725),
    star(vec2(0.827, 0.674), 8.0, 1.611),
    star(vec2(0.487, 0.516), 7.0, 3.437),
    star(vec2(0.397, 0.651), 5.0, 2.074),
    star(vec2(0.636, 0.853), 1.0, 1.277),
    star(vec2(0.176, 0.241), 9.0, 4.971),
    star(vec2(0.262, 0.605), 6.0, 2.518),
    star(vec2(0.355, 0.452), 8.0, 1.172),
    star(vec2(0.232, 0.861), 4.0, 3.956),
    star(vec2(0.544, 0.477), 2.0, 2.012),
    star(vec2(0.933, 0.23), 7.0, 4.328),
    star(vec2(0.267, 0.133), 5.0, 2.611),
    star(vec2(0.409, 0.488), 3.0, 1.025),
    star(vec2(0.857, 0.732), 9.0, 3.598),
    star(vec2(0.645, 0.307), 6.0, 4.866),
    star(vec2(0.535, 0.749), 1.0, 2.768),
    star(vec2(0.359, 0.21), 8.0, 4.532),
    star(vec2(0.274, 0.737), 7.0, 1.885),
    star(vec2(0.156, 0.438), 3.0, 3.982),
    star(vec2(0.899, 0.366), 6.0, 2.336),
    star(vec2(0.724, 0.825), 4.0, 1.108),
    star(vec2(0.221, 0.148), 2.0, 0.695),
    star(vec2(0.173, 0.517), 7.0, 4.312),
    star(vec2(0.419, 0.726), 5.0, 2.535),
    star(vec2(0.726, 0.202), 4.0, 4.748),
    star(vec2(0.143, 0.764), 8.0, 3.195),
    star(vec2(0.847, 0.532), 6.0, 1.598),
    star(vec2(0.606, 0.214), 9.0, 3.798),
    star(vec2(0.97, 0.416), 3.0, 1.999),
    star(vec2(0.315, 0.298), 1.0, 4.238),
    star(vec2(0.258, 0.827), 7.0, 2.763),
    star(vec2(0.374, 0.49), 6.0, 3.988),
    star(vec2(0.609, 0.964), 5.0, 2.127),
    star(vec2(0.899, 0.196), 3.0, 4.811),
    star(vec2(0.178, 0.261), 9.0, 1.674),
    star(vec2(0.363, 0.687), 4.0, 2.976),
    star(vec2(0.948, 0.369), 2.0, 3.512),
    star(vec2(0.661, 0.855), 7.0, 1.777),
    star(vec2(0.341, 0.279), 6.0, 3.325),
    star(vec2(0.532, 0.615), 3.0, 2.199),
    star(vec2(0.457, 0.915), 8.0, 4.159),
    star(vec2(0.745, 0.229), 5.0, 2.629),
    star(vec2(0.264, 0.369), 1.0, 4.794),
    star(vec2(0.646, 0.871), 6.0, 2.325),
    star(vec2(0.227, 0.218), 7.0, 1.718),
    star(vec2(0.134, 0.437), 5.0, 3.88),
    star(vec2(0.791, 0.257), 2.0, 1.469),
    star(vec2(0.318, 0.846), 9.0, 0.995),
    star(vec2(0.939, 0.551), 6.0, 3.611),
    star(vec2(0.401, 0.395), 1.0, 2.271),
    star(vec2(0.555, 0.669), 7.0, 1.41),
    star(vec2(0.433, 0.919), 3.0, 3.845),
    star(vec2(0.618, 0.387), 9.0, 1.648),
    star(vec2(0.16, 0.15), 4.0, 4.424),
    star(vec2(0.254, 0.475), 5.0, 2.772),
    star(vec2(0.684, 0.674), 6.0, 4.257),
    star(vec2(0.963, 0.334), 8.0, 1.94),
    star(vec2(0.212, 0.297), 3.0, 3.091),
    star(vec2(0.536, 0.608), 1.0, 1.843),
    star(vec2(0.846, 0.925), 9.0, 4.237),
    star(vec2(0.341, 0.167), 7.0, 2.315),
    star(vec2(0.474, 0.594), 6.0, 0.982),
    star(vec2(0.685, 0.837), 5.0, 3.757),
    star(vec2(0.639, 0.728), 7.0, 2.287),
    star(vec2(0.877, 0.442), 8.0, 3.712),
    star(vec2(0.393, 0.806), 9.0, 4.521),
    star(vec2(0.561, 0.369), 3.0, 2.045),
    star(vec2(0.212, 0.57), 5.0, 3.693),
    star(vec2(0.774, 0.289), 4.0, 1.943),
    star(vec2(0.943, 0.528), 6.0, 4.322),
    star(vec2(0.456, 0.324), 3.0, 2.554),
    star(vec2(0.671, 0.678), 7.0, 1.423),
    star(vec2(0.289, 0.902), 9.0, 3.877),
    star(vec2(0.521, 0.453), 5.0, 1.754),
    star(vec2(0.834, 0.567), 8.0, 4.216),
    star(vec2(0.438, 0.748), 6.0, 2.813),
    star(vec2(0.756, 0.173), 2.0, 3.699),
    star(vec2(0.167, 0.244), 4.0, 1.123),
    star(vec2(0.932, 0.839), 7.0, 3.298),
    star(vec2(0.687, 0.628), 5.0, 2.811),
    star(vec2(0.567, 0.968), 9.0, 1.249),
    star(vec2(0.419, 0.518), 3.0, 4.911),
    star(vec2(0.325, 0.335), 6.0, 2.612)
);

float posterize(float num, int steps) {
  float res = num * float(steps);
  res = floor(res);
  res = res / float(steps);
  return res;
}

vec3 posterize(vec3 col, int steps) {
  vec3 stepsVec = vec3(steps, steps, steps);
  vec3 res = col * stepsVec;
  res = floor(res);
  res = res / stepsVec;
  return res;
}

//distance from line segment
float lineDist(vec2 p, vec2 a, vec2 b) {
    p -= a, b -= a;
    float h = clamp(dot(p, b) / dot(b, b), 0., 1.);// proj coord on line
    return length(p - b * h);                      // dist to segment
    // We might directly return smoothstep( 3./R.y, 0., dist),
    //     but its more efficient to factor all lines.
    // We can even return dot(,) and take sqrt at the end of polyline:
    // p -= b*h; return dot(p,p);
}

vec3 calcLeaf(vec2 uv, vec3 col, vec2 leafPos, float leafSize) {
  float d = 0.0;
  uv = uv - leafPos;

  //uv = uv *2.-1.;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(uv.x, uv.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(uv);
  d = d * (1.0/leafSize);

  vec3 res = vec3(smoothstep(.4,.41,d));
  return col * res;
}

vec3 calcTree(vec2 uv, vec3 col, tree t) {
  float dist = lineDist(uv, t.pos, t.pos + vec2(0, t.height));
  dist = step(t.width, dist);
  for(int i=0; i<t.leafCount; i++) {
    vec2 leafPos = vec2(t.pos.x, mix(t.height * t.leafHeightCutoff + t.pos.y, t.height + t.pos.y, float(i) / float(t.leafCount)));
    float leafSize = mix(t.leafSize * t.leafSizeScaling, t.leafSize, float(i) / float(t.leafCount));
    leafPos.y = leafPos.y + leafSize;
    col = calcLeaf(uv, col, leafPos, leafSize);
  }
  return col * dist;
}

//Currently assumes use of testStars
star GetNearestStar(vec2 uv) {
  int nearest = 0;
  float nearestDist = 10000000.0;
  for(int i=0; i<testStars.length(); i++) {
    float dist = distance(uv, testStars[i].pos);
    if(dist < nearestDist) {
      nearest = i;
      nearestDist = dist;
    }
  }
  return testStars[nearest];
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  //Get sun position
  vec2 sunPos = vec2(sin(time * 0.02), cos(time * 0.02));
  sunPos.x *= 1.3;
  sunPos += vec2(1);
  sunPos *= 0.55;
  sunPos.y *= step(0.5, sunPos.y);
  float sunDist = distance(sunPos, uv);
  sunDist = step(0.12, sunDist);

  //Get color from time of day
  float timeOfDay = (sin(time * 0.01) * 0.5) + 0.5;
  vec3 topColor = mix(topColorDay, topColorNight, timeOfDay);
  vec3 bottomColor = mix(bottomColorDay, bottomColorNight, timeOfDay);
  vec3 groundColor = mix(groundColorDay, groundColorNight, timeOfDay);
  vec3 sunColor = topColor * 1.25;
  vec3 col = mix(bottomColor, topColor, posterize(uv.y, 10));
  col = mix(sunColor, col, sunDist);

  //Add stars
  star closeStar = GetNearestStar(uv);
  float starDist = distance(uv, closeStar.pos);
  starDist = step((sin(time * 0.25 + closeStar.timeOffset) * 0.5 + 0.5) * closeStar.size * timeOfDay * 0.0003, starDist);
  col = mix(starColor, col, starDist);

  //Create ground
  float groundDist = distance(uv, vec2(0.5, -0.5));
  groundDist = step(0.8, groundDist);
  col = mix(groundColor, col, groundDist);

  //Create trees
  for(int i=0; i<testTrees.length(); i++) {
    col = calcTree(uv, col, testTrees[i]);
  }

  gl_FragColor = vec4(col.xyz, 1);
}