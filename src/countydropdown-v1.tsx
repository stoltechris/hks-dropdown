import React, { useState, useRef, useEffect } from "react";

type CountyNode = {
  id: number;
  name: string;
  level: "region" | "state" | "county";
  parent: number | null;
  children: CountyNode[] | [];
};

type CountyDropdownProps = {
  data: CountyNode[];
  value: number | null;
  onChange: (county: CountyNode) => void;
};

const CountyDropdown: React.FC<CountyDropdownProps> = ({ data, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected county by id
  const findCounty = (nodes: CountyNode[]): CountyNode | undefined => {
    for (const region of nodes) {
      for (const state of region.children) {
        for (const county of state.children) {
          if (county.id === value) return county;
        }
      }
    }
    return undefined;
  };

  const selectedCounty = value ? findCounty(data) : undefined;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: 500 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "8px",
          textAlign: "left",
          border: "1px solid #ccc",
          borderRadius: 4,
          background: "#fff",
        }}
      >
        {selectedCounty ? selectedCounty.name : "Please select a county"}
        <span style={{ float: "right" }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "500px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            maxHeight: 540,
            overflowY: "auto",
            marginTop: 2,
          }}
        >
          {data.map((region) => (
            <div key={region.id}>
                <div style={{ fontWeight: "bold", padding: "8px 12px", background: "#f6f6f6" }}>
                {region.name}
                </div>
                {(region.children ?? []).map((state) => (
                <div key={state.id}>
                    <div style={{ fontWeight: 500, padding: "6px 32px", background: "#fafafa" }}>
                    {state.name}
                    </div>
                    {(state.children ?? []).map((county) => (
                    <div
                        key={county.id}
                        style={{
                        padding: "6px 52px",
                        cursor: "pointer",
                        background: value === county.id ? "#e6f7ff" : "#fff",
                        }}
                        onClick={() => {
                        onChange(county);
                        setOpen(false);
                        }}
                    >
                        {county.name}
                    </div>
                    ))}
                </div>
                ))}
            </div>
        ))}
        </div>
    )}
    </div>
  );
};

export default CountyDropdown;