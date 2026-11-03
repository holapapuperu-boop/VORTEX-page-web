import s from "./cafe.module.css";

/** Paisaje volcánico en capas (SVG). Las capas se mueven a distinta velocidad al hacer scroll. */
export default function Landscape() {
  const bushes = Array.from({ length: 30 }, (_, i) => {
    const x = i * 52 - 20;
    const y = 806 - Math.sin(i * 0.55) * 14 + (i % 3) * 5;
    return { x, y, rx: 34 + (i % 4) * 5, ry: 17 + (i % 3) * 4 };
  });
  return (
    <svg className={s.landscape} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1424" />
          <stop offset=".5" stopColor="#47203f" />
          <stop offset=".8" stopColor="#a3203f" />
          <stop offset="1" stopColor="#e9a23b" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="glow" x="-100%" y="-300%" width="300%" height="700%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#sky)" />
      <g className={s.lSun}><circle cx="1040" cy="560" r="130" fill="#f3c26b" opacity=".92" /></g>
      <g className={s.lFar}>
        <path d="M0 600 L170 500 L320 566 L520 470 L690 556 L900 480 L1110 570 L1300 500 L1440 552 V900 H0Z" fill="#3a1b38" />
      </g>
      <g className={s.lVolcano}>
        <path d="M230 900 L590 430 Q640 372 682 368 L758 368 Q800 372 850 430 L1210 900Z" fill="#241830" />
        <path d="M590 430 Q640 372 682 368 L700 368 L650 470 L610 520Z" fill="#33203f" opacity=".7" />
        <ellipse className={s.lava} cx="720" cy="370" rx="52" ry="8" fill="#e9a23b" filter="url(#glow)" />
        <ellipse cx="720" cy="370" rx="40" ry="5" fill="#f6c566" />
        <g filter="url(#soft)">
          <circle className={`${s.smoke} ${s.sm1}`} cx="720" cy="360" r="34" fill="#cfc6d6" />
          <circle className={`${s.smoke} ${s.sm2}`} cx="720" cy="360" r="40" fill="#b9aec4" />
          <circle className={`${s.smoke} ${s.sm3}`} cx="720" cy="360" r="30" fill="#e0d9e6" />
        </g>
      </g>
      <g className={s.lMid}>
        <path d="M0 730 Q200 650 430 720 T820 750 T1220 690 T1440 730 V900 H0Z" fill="#1a1222" />
      </g>
      <g className={s.lFront}>
        <path d="M0 800 Q300 756 640 812 T1440 790 V900 H0Z" fill="#120d18" />
        {bushes.map((b, i) => <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={i % 2 ? "#1d3324" : "#244030"} />)}
        <rect y="830" width="1440" height="80" fill="#0e0a13" />
      </g>
    </svg>
  );
}
