const CircusLogo = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tent roof — three triangular peaks */}
      <polygon points="50,5 95,45 5,45" fill="#922B21" />
      <polygon points="50,5 70,45 30,45" fill="#C0392B" />
      {/* Flag on top */}
      <rect x="48" y="0" width="4" height="12" fill="#D4AC0D" />
      <polygon points="52,2 64,7 52,12" fill="#D4AC0D" />
      {/* Tent body */}
      <rect x="15" y="45" width="70" height="45" rx="2" fill="#C0392B" />
      {/* Vertical stripes on tent body */}
      <rect x="28" y="45" width="8" height="45" fill="#922B21" opacity="0.5" />
      <rect x="50" y="45" width="8" height="45" fill="#922B21" opacity="0.5" />
      <rect x="72" y="45" width="8" height="45" fill="#922B21" opacity="0.5" />
      {/* Entrance arch */}
      <path d="M38 90 Q38 68 50 68 Q62 68 62 90" fill="#1C1C1C" />
      {/* Gold trim on roof bottom */}
      <rect x="5" y="43" width="90" height="5" fill="#D4AC0D" />
    </svg>
  );
};

export default CircusLogo;
