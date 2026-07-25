import { useState } from 'react'
import { Nav } from '../components/nav'
import { toast } from 'sonner'

export function SlitCalculator() {
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [sameAsTracks, setSameAsTracks] = useState(true)
    const [ups, setUps] = useState('')
    const [tracks, setTracks] = useState('')
    const [labelPerRoll, setLabelPerRoll] = useState('')
    const [rollQuantity, setRollQuantity] = useState('')
    const [results, setResults] = useState(null)
    const [showResults, setShowResults] = useState(false)

    function getUps(tracksVal) {
        if (sameAsTracks) return null

        const upsVal = parseInt(ups, 10)

        if (tracksVal > upsVal || upsVal % tracksVal !== 0) {
            toast.error(`Invalid: tracks must be less than or equal to ${upsVal} and divide evenly into it.`)
            return 0
        }

        return upsVal
    }

    function calculate() {
        setResults(null)
        setShowResults(false)

        const tracksVal = parseInt(tracks, 10)
        const upsVal = getUps(tracksVal)
        const widthVal = parseFloat(width)
        const heightVal = parseFloat(height)
        const labelPerRollVal = parseFloat(labelPerRoll)
        const rollQuantityVal = parseFloat(rollQuantity)

        let columns = tracksVal
        let minQty = 1

        if (upsVal) {
            columns = upsVal
            minQty = upsVal / tracksVal
            if (rollQuantityVal % minQty !== 0) {
                toast.error(`Invalid: roll quantity must be a multiple of ${minQty} (Quantity produced by die simultaneously).`)
                return
            }
        } else if (upsVal === 0) {
            return
        }

        const slitSize = (widthVal * columns) + ((columns - 1) * 2) + 8
        const singleRollMeters = (((heightVal + 3) / 1000) * labelPerRollVal) / tracksVal
        const totalMeters = (((heightVal + 3) / 1000) * labelPerRollVal / columns) * rollQuantityVal

        setResults({
            slitSize: slitSize.toFixed(2),
            totalMeters: totalMeters.toFixed(2),
            minQty,
            singleRollMeters: singleRollMeters.toFixed(2),
        })
        setShowResults(true)
    }

    return (
        <>
            <Nav active="slit" />

            <main>
                <div className="sheet">
                    <div className="regmark tl"><span></span></div>
                    <div className="regmark tr"><span></span></div>
                    <div className="regmark bl"><span></span></div>
                    <div className="regmark br"><span></span></div>

                    <div className="sheet-header">
                        <p className="eyebrow">Spec Sheet · 001</p>
                        <h2>Slit Size &amp; Paper Length</h2>
                        <p className="sub">Enter roll specs to calculate slit width and paper required.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="field">
                            <label htmlFor="width">Width (mm)</label>
                            <input
                                type="number"
                                id="width"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="height">Height (mm)</label>
                            <input
                                type="number"
                                id="height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>

                        <div className="field full checkbox-field">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="sameAsTracks"
                                    checked={sameAsTracks}
                                    onChange={(e) => setSameAsTracks(e.target.checked)}
                                />
                                Die Ups same as tracks?
                            </label>
                        </div>

                        <div className={`field full${!sameAsTracks ? ' show' : ''}`} id="toggleUps">
                            <label htmlFor="ups">Ups</label>
                            <input
                                type="number"
                                id="ups"
                                value={ups}
                                onChange={(e) => setUps(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="tracks">Tracks</label>
                            <input
                                type="number"
                                id="tracks"
                                value={tracks}
                                onChange={(e) => setTracks(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="label_per_role">Labels / Roll</label>
                            <input
                                type="number"
                                id="label_per_role"
                                value={labelPerRoll}
                                onChange={(e) => setLabelPerRoll(e.target.value)}
                            />
                        </div>
                        <div className="field full">
                            <label htmlFor="roll_quantity">Roll Quantity</label>
                            <input
                                type="number"
                                id="roll_quantity"
                                value={rollQuantity}
                                onChange={(e) => setRollQuantity(e.target.value)}
                            />
                        </div>
                    </form>

                    <div className="actions">
                        <button type="button" onClick={calculate}>Calculate</button>
                    </div>

                    <div className={`output${showResults ? ' show' : ''}`}>
                        {results && (
                            <>
                                <span className="k">Slit size:</span> <span className="v">{results.slitSize} mm</span><br />
                                <span className="k">Paper length required:</span> <span className="v">{results.totalMeters} meters</span><br />
                                <span className="k">Bom quantity (output quantity):</span> <span className="v">{results.minQty}</span><br />
                                <span className="k">Bom material quantity:</span> <span className="v">{results.singleRollMeters} meters</span>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <footer>Merak Labels Pvt. Ltd. · Internal Use</footer>
        </>
    )
}