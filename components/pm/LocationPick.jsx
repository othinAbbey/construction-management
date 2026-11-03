import { useEffect, useState } from "react";
import { Select } from "./ui";

/** Region then district; reports the chosen location id (as a string). */
export default function LocationPick({ locations, value, onChange, required }) {
  const cur = locations.find((l) => String(l.id) === String(value));
  const [region, setRegion] = useState(cur?.region || "");
  useEffect(() => { if (cur) setRegion(cur.region); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  const regions = [...new Set(locations.map((l) => l.region))];
  return (
    <>
      <Select label="Region" value={region} blank="Select region" onChange={(r) => { setRegion(r); onChange(""); }} options={regions.map((r) => ({ v: r, l: r }))} />
      <Select label="District" value={value ?? ""} required={required} blank="Select district" onChange={onChange}
        options={locations.filter((l) => l.region === region).map((l) => ({ v: l.id, l: l.district }))} />
    </>
  );
}
