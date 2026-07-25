import { useState, useRef } from 'react'
import { Nav } from '../components/nav'

export function LabelVisualizer() {
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [tracks, setTracks] = useState('')
    const [artworkFile, setArtworkFile] = useState(null)
    const [svgMarkup, setSvgMarkup] = useState('')
    const [resultsHtml, setResultsHtml] = useState('')
    const [showDiagram, setShowDiagram] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [showDownload, setShowDownload] = useState(false)

    const fileInputRef = useRef(null)
    const diagramWrapRef = useRef(null)

    function handleArtworkChange(e) {
        setArtworkFile(e.target.files[0] || null)
    }

    function clearArtwork() {
        setArtworkFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''

        if (diagramWrapRef.current?.querySelector('svg')) {
            visualize(null)
        }
    }

    function visualize(overrideFile) {
        const widthVal = parseFloat(width)
        const heightVal = parseFloat(height)
        const tracksVal = parseInt(tracks, 10)
        const file = overrideFile !== undefined ? overrideFile : artworkFile

        if (!widthVal || !heightVal || !tracksVal || widthVal <= 0 || heightVal <= 0 || tracksVal <= 0) {
            setResultsHtml('<span class="k">Enter a valid width, height, and track count to see the layout.</span>')
            setSvgMarkup('')
            setShowDiagram(false)
            setShowResults(false)
            setTimeout(() => setShowResults(true), 0)
            setShowDownload(false)
            return
        }

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => renderDiagram(widthVal, heightVal, tracksVal, e.target.result)
            reader.readAsDataURL(file)
        } else {
            renderDiagram(widthVal, heightVal, tracksVal, null)
        }
    }

    function renderDiagram(width, height, tracks, artworkDataUrl) {
        const trackGap = 2
        const sideTrim = 4
        const repeatGap = 3
        const repeats = 4
        const topMargin = 18
        const leftMargin = 14
        const cornerRadius = 2

        const webWidth = (width * tracks) + ((tracks - 1) * trackGap) + (sideTrim * 2)
        const contentHeight = (height * repeats) + ((repeats - 1) * repeatGap)
        const svgW = webWidth + leftMargin + 6
        const svgH = contentHeight + topMargin + 10

        let defsSVG = ''
        let labelsSVG = ''

        for (let t = 0; t < tracks; t++) {
            const x = leftMargin + sideTrim + t * (width + trackGap)
            for (let r = 0; r < repeats; r++) {
                const y = topMargin + r * (height + repeatGap)
                const clipId = `clip-${t}-${r}`

                if (artworkDataUrl) {
                    defsSVG += `<clipPath id="${clipId}">
                        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}"/>
                    </clipPath>`

                    labelsSVG += `
                        <image href="${artworkDataUrl}" x="${x}" y="${y}" width="${width}" height="${height}"
                            preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
                        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}"
                            fill="none" stroke="#1d6fdb" stroke-width="0.6"/>`
                } else {
                    labelsSVG += `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}"
                        fill="rgba(29,111,219,0.16)" stroke="#1d6fdb" stroke-width="0.6"/>`
                }
            }
        }

        const trimLines = `
            <line x1="${leftMargin}" y1="${topMargin - 4}" x2="${leftMargin}" y2="${svgH - 4}"
                stroke="#0f2438" stroke-width="0.4" stroke-dasharray="1.5,1.5" opacity="0.5"/>
            <line x1="${leftMargin + webWidth}" y1="${topMargin - 4}" x2="${leftMargin + webWidth}" y2="${svgH - 4}"
                stroke="#0f2438" stroke-width="0.4" stroke-dasharray="1.5,1.5" opacity="0.5"/>
        `

        const dimW = `
            <line x1="${leftMargin}" y1="4" x2="${leftMargin + webWidth}" y2="4"
                stroke="#0f2438" stroke-width="0.4"/>
            <line x1="${leftMargin}" y1="1.5" x2="${leftMargin}" y2="6.5" stroke="#0f2438" stroke-width="0.4"/>
            <line x1="${leftMargin + webWidth}" y1="1.5" x2="${leftMargin + webWidth}" y2="6.5" stroke="#0f2438" stroke-width="0.4"/>
            <text x="${leftMargin + webWidth / 2}" y="3" font-size="4.2" text-anchor="middle"
                fill="#0f2438" font-family="JetBrains Mono, monospace">Web width: ${webWidth.toFixed(1)} mm</text>
        `

        const singleX0 = leftMargin + sideTrim
        const dimSingleW = `
            <line x1="${singleX0}" y1="12" x2="${singleX0 + width}" y2="12"
                stroke="#0f2438" stroke-width="0.4"/>
            <line x1="${singleX0}" y1="9.5" x2="${singleX0}" y2="14.5" stroke="#0f2438" stroke-width="0.4"/>
            <line x1="${singleX0 + width}" y1="9.5" x2="${singleX0 + width}" y2="14.5" stroke="#0f2438" stroke-width="0.4"/>
            <text x="${singleX0 + width / 2}" y="11" font-size="4.2" text-anchor="middle"
                fill="#0f2438" font-family="JetBrains Mono, monospace">Label width: ${width.toFixed(1)} mm</text>
        `

        const dimH = `
            <line x1="${leftMargin - 4}" y1="${topMargin}" x2="${leftMargin - 4}" y2="${topMargin + height}"
                stroke="#0f2438" stroke-width="0.4"/>
            <text x="${leftMargin - 6}" y="${topMargin + height / 2}" font-size="4.2" text-anchor="middle"
                fill="#0f2438" font-family="JetBrains Mono, monospace"
                transform="rotate(-90 ${leftMargin - 6} ${topMargin + height / 2})">${height.toFixed(1)} mm</text>
        `

        const markup = `
            <svg viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="xMidYMid meet">
                <defs>${defsSVG}</defs>
                ${trimLines}
                ${labelsSVG}
                ${dimW}
                ${dimSingleW}
                ${dimH}
            </svg>
        `

        setSvgMarkup(markup)

        setResultsHtml(
            `<span class="k">Single label size:</span> <span class="v">${width.toFixed(1)} × ${height.toFixed(1)} mm</span> (width × height)<br>` +
            `<span class="k">Web width (all tracks combined):</span> <span class="v">${webWidth.toFixed(2)} mm</span><br>` +
            `<span class="k">Labels across (tracks):</span> <span class="v">${tracks}</span>` +
            (artworkDataUrl ? `<br><span class="k">Artwork:</span> <span class="v">applied</span>` : '')
        )

        setShowDiagram(false)
        setShowResults(false)
        setTimeout(() => {
            setShowDiagram(true)
            setShowResults(true)
        }, 0)

        setShowDownload(true)
    }

    function downloadDiagram() {
        const svgEl = diagramWrapRef.current?.querySelector('svg')
        if (!svgEl) {
            window.showAlert('Generate a diagram first.', 'error')
            return
        }

        const scale = 4
        const viewBox = svgEl.getAttribute('viewBox').split(' ').map(Number)
        const w = viewBox[2], h = viewBox[3]

        const svgString = new XMLSerializer().serializeToString(svgEl)
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        const img = new Image()
        img.onload = function () {
            const canvas = document.createElement('canvas')
            canvas.width = w * scale
            canvas.height = h * scale
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)

            canvas.toBlob(function (blob) {
                const link = document.createElement('a')
                link.download = 'label-layout.png'
                link.href = URL.createObjectURL(blob)
                link.click()
                window.showAlert('Diagram downloaded.', 'success')
            })
        }
        img.onerror = function () {
            URL.revokeObjectURL(url)
            window.showAlert('Could not export diagram.', 'error')
        }
        img.src = url
    }

    return (
        <>
            <Nav active="visualizer" />

            <main>
                <div className="sheet sheet-wide">
                    <div className="regmark tl"><span></span></div>
                    <div className="regmark tr"><span></span></div>
                    <div className="regmark bl"><span></span></div>
                    <div className="regmark br"><span></span></div>

                    <div className="sheet-header">
                        <p className="eyebrow">Spec Sheet · 002</p>
                        <h2>Label Roll Visualizer</h2>
                        <p className="sub">Enter label size and tracks to preview the die layout across the web.</p>
                    </div>

                    <form className="form-3col" onSubmit={(e) => e.preventDefault()}>
                        <div className="field">
                            <label htmlFor="lwidth">Width (mm)</label>
                            <input
                                type="number"
                                id="lwidth"
                                min="1"
                                step="0.1"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="lheight">Height (mm)</label>
                            <input
                                type="number"
                                id="lheight"
                                min="1"
                                step="0.1"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="ltracks">Tracks</label>
                            <input
                                type="number"
                                id="ltracks"
                                min="1"
                                step="1"
                                value={tracks}
                                onChange={(e) => setTracks(e.target.value)}
                            />
                        </div>
                        <div className="field full">
                            <label htmlFor="lartwork">Artwork (optional)</label>
                            <div className="file-row">
                                <input
                                    type="file"
                                    id="lartwork"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleArtworkChange}
                                />
                                {artworkFile && (
                                    <button type="button" className="clear-btn" onClick={clearArtwork}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    <div className="actions">
                        <button type="button" onClick={() => visualize()}>Visualize</button>
                    </div>

                    <div
                        className={`diagram-wrap${showDiagram ? ' show' : ''}`}
                        ref={diagramWrapRef}
                        dangerouslySetInnerHTML={{ __html: svgMarkup }}
                    />

                    {showDownload && (
                        <div className="actions" style={{ paddingTop: 0 }}>
                            <button
                                type="button"
                                onClick={downloadDiagram}
                                style={{ background: 'var(--ink)' }}
                            >
                                Download Diagram (PNG)
                            </button>
                        </div>
                    )}

                    <div
                        className={`output${showResults ? ' show' : ''}`}
                        dangerouslySetInnerHTML={{ __html: resultsHtml }}
                    />
                </div>
            </main>

            <footer>Merak Labels Pvt. Ltd. · Internal Use</footer>
        </>
    )
}