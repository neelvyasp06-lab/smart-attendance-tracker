import { useState } from "react";
import { Scan, AlertTriangle, CheckCircle2, XCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
const mockResults = [
    { name: "Anika Patel", confidence: 97.3, status: "recognized" },
    { name: "Marcus Chen", confidence: 92.1, status: "recognized" },
    { name: "Unknown", confidence: 34.8, status: "unrecognized" },
    { name: "Sofia Rodriguez", confidence: 95.6, status: "recognized" },
    { name: "James Okafor", confidence: 88.4, status: "duplicate" },
];
export default function AIModulePage() {
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [currentScan, setCurrentScan] = useState("");
    const startScan = () => {
        setScanning(true);
        setResults([]);
        setScanProgress(0);
        setCurrentScan("Initializing camera...");
        let i = 0;
        const interval = setInterval(() => {
            if (i < mockResults.length) {
                setScanProgress(((i + 1) / mockResults.length) * 100);
                setCurrentScan(`Scanning face ${i + 1} of ${mockResults.length}...`);
                setResults((prev) => [...prev, mockResults[i]]);
                i++;
            }
            else {
                clearInterval(interval);
                setScanning(false);
                setCurrentScan("Scan complete");
            }
        }, 1200);
    };
    return (<div className="space-y-6 max-w-7xl">
      <div className="animate-fade-up">
        <h1 className="page-header">AI Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Face recognition powered attendance scanning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera preview */}
        <div className="glass-panel rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="relative aspect-video bg-foreground/5 flex items-center justify-center overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
            backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
        }}/>
            </div>

            {/* Scan line */}
            {scanning && (<div className="absolute left-0 right-0 h-0.5 gradient-primary opacity-60 animate-scan-line"/>)}

            {/* Center reticle */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-2 ${scanning ? "border-primary" : "border-muted-foreground/30"} flex items-center justify-center transition-colors`}>
                {scanning && (<div className="absolute w-32 h-32 rounded-full border-2 border-primary animate-pulse-ring"/>)}
                <Camera className={`w-10 h-10 ${scanning ? "text-primary" : "text-muted-foreground/50"} transition-colors`}/>
              </div>
            </div>

            {/* Status */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-2">
                {scanning && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>}
                <span className="text-xs font-medium">{currentScan || "Camera ready"}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {scanning && (<div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${scanProgress}%` }}/>
              </div>)}
            <Button onClick={startScan} disabled={scanning} className="w-full h-11 rounded-xl gradient-primary text-primary-foreground active:scale-[0.98] transition-transform">
              <Scan className="w-4 h-4 mr-2"/>
              {scanning ? "Scanning..." : "Start Face Scan"}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="glass-panel rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <h3 className="text-sm font-semibold mb-4">Scan Results</h3>
          {results.length === 0 ? (<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Scan className="w-10 h-10 mb-3 opacity-30"/>
              <p className="text-sm">No scan results yet</p>
              <p className="text-xs mt-1">Start a face scan to see results here</p>
            </div>) : (<div className="space-y-3">
              {results.map((r, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    {r.status === "recognized" && <CheckCircle2 className="w-5 h-5 text-success"/>}
                    {r.status === "unrecognized" && <XCircle className="w-5 h-5 text-destructive"/>}
                    {r.status === "duplicate" && <AlertTriangle className="w-5 h-5 text-warning"/>}
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{r.status === "duplicate" ? "Duplicate entry" : r.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold tabular-nums ${r.confidence > 80 ? "text-success" : "text-destructive"}`}>
                      {r.confidence}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">confidence</p>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </div>);
}
