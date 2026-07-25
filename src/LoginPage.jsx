import { useState, useEffect } from 'react'
import { OTPInput } from 'input-otp'
import { supabase } from './supabaseClient'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import { formatMessage } from './Utility/Helpers'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [step, setStep] = useState('email')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    async function sendOtp() {

        setLoading(true)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false }
        })

        setLoading(false)

        if (error) {
            toast.error(formatMessage(error.message))
        } else {
            setStep('otp')
            setCooldown(RESEND_COOLDOWN)
            setOtp('')
        }
    }

    async function verifyCode(code) {
    
        setLoading(true)

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'email',
        })

        setLoading(false)

        if (error) {
            toast.error(formatMessage(error.message))
            setOtp('')
        }
        // on success, AuthProvider's listener picks up the new session automatically
    }

    function handleEmailSubmit(e) {
        e.preventDefault()
        sendOtp()
    }

    function handleOtpChange(value) {
        setOtp(value)
        if (value.length === OTP_LENGTH) {
            verifyCode(value)
        }
    }

    return (
        <main>
            <div className="sheet">
                <div className="regmark tl"><span></span></div>
                <div className="regmark tr"><span></span></div>
                <div className="regmark bl"><span></span></div>
                <div className="regmark br"><span></span></div>

                <div className="sheet-header">
                    <p className="eyebrow">Merak Labels · Shop Tools</p>
                    <h2>Sign In</h2>
                    <p className="sub">
                        {step === 'email'
                            ? 'Enter your email to receive a login code.'
                            : `We sent a ${OTP_LENGTH}-digit code to ${email}`}
                    </p>
                </div>

                {step === 'email' && (
                    <>
                        <form onSubmit={handleEmailSubmit}>
                            <div className="field full">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </form>
                        <div className="actions">
                            <button type="button" onClick={handleEmailSubmit} disabled={loading}>
                                {loading ? <BarLoader color="#ffffff" width={100} height={4} /> : 'Send Code'}
                            </button>
                        </div>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <div className="field full">
                            <OTPInput
                                maxLength={OTP_LENGTH}
                                value={otp}
                                onChange={handleOtpChange}
                                disabled={loading}
                                containerClassName="otp-boxes"
                                render={({ slots }) => (
                                    <>
                                        {slots.map((slot, i) => (
                                            <div
                                                key={i}
                                                className={`otp-box${slot.isActive ? ' otp-box-active' : ''}`}
                                            >
                                                {slot.char}
                                                {slot.hasFakeCaret && <div className="otp-caret" />}
                                            </div>
                                        ))}
                                    </>
                                )}
                            />
                        </div>

                        <div className="actions">
                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={cooldown > 0 || loading}
                                className="resend-btn"
                            >
                                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </main>
    )
}