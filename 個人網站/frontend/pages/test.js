import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const copy = 'Parallax'.split('');
export default function test() {
    return (
        <>
            <div style={{height: "100vh", width: "100vw"}}>

            </div>
            <div style={{height: "50vh", width: "100vw", display: "flex", "flex-flow": "column wrap", "align-items": "center", "justify-content": "center"}}>
                <div style={{"margin-left": "0.8em", width: "20em", height: "1.5em", "border-top": "0.45em solid purple", "border-bottom": "0.45em solid purple", transform: "skew(-10deg)"}}></div>
                <span style={{margin: "0.2em 0", "text-align": "center", "font-size": "4em", "text-transform": "uppercase", "font-weight": "700", "font-style": "italic", "letter-spacing": "0.3em", color: "#3d3547"}}>
                    {copy.map((letter, i) => (
                        <Parallax key={`copy-${i}`}
                        x={[-50, 50]} className="letter">
                            {letter}
                        </Parallax>
                    ))}
                </span>
                <div style={{"margin-right": "0.8em", width: "20em", height: "1.5em", "border-top": "0.45em solid purple", "border-bottom": "0.45em solid purple", transform: "skew(-10deg)"}}></div>
            </div>
            <div style={{height: "100vh", width: "100vw"}}>

            </div>
        </>
    )
}