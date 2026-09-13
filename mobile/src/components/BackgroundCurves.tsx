import Svg, { Path } from 'react-native-svg';

export default function BackgroundCurves() {
  return (
    <Svg
      style={{ position: 'absolute', top: 0, left: 0 }}
      width="100%"
      height="100%"
      viewBox="0 0 320 600"
      preserveAspectRatio="none"
    >
      <Path
        d="M0,60 C100,30 130,150 210,125 C270,108 285,55 320,85 L320,0 L0,0 Z"
        fill="#E0714B"
        opacity={0.7}
      />
      <Path
        d="M0,80 C90,150 60,220 150,230 C240,240 260,120 320,160 L320,0 L0,0 Z"
        fill="#178449"
        opacity={0.55}
      />
      <Path
        d="M0,140 C100,200 80,260 170,270 C260,280 250,180 320,210 L320,0 L0,0 Z"
        fill="#0F6E56"
        opacity={0.5}
      />
    </Svg>
  );
}
/*es un SVG con 3 formas superpuestas (Path), 
cada una una curva; opacity controla qué tan visible es cada capa*/
