import { useState } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState({ email: false, password: false })
  const [isLoading, setIsLoading] = useState(false)

  const emailError = touched.email && !email
  const passwordError = touched.password && !password
  const isDisabled = !email || !password || isLoading

  const login = async () => {
    // Mark fields as touched
    setTouched({ email: true, password: true })
    
    if (!email || !password) return

    setIsLoading(true)

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem("token", res.data.token)

      window.location = "/dashboard"

    } catch (err) {
      setIsLoading(false)
      alert("Login failed")

    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isDisabled) {
      login()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900 p-4">
      {/* Neon glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500 rounded-full opacity-40 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full opacity-40 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600 rounded-full opacity-20 blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Neon border card */}
        <div className="relative group">
          {/* Neon glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-3xl opacity-60 group-hover:opacity-100 blur transition duration-500" />
          
          {/* Glassmorphism Card */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold tracking-wide text-white mb-2 drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-cyan-200/70 text-sm">
                Sign in to access your precious memories
              </p>
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-5"
            >
              <label className="block text-sm font-medium text-cyan-200 mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter your email"
                className={`
                  w-full px-4 py-3 rounded-xl bg-gray-800/50 
                  border-2 transition-all duration-200 outline-none
                  text-white placeholder-gray-400
                  focus:ring-2 focus:ring-cyan-400
                  ${emailError 
                    ? "border-red-400 focus:border-red-400" 
                    : "border-cyan-500/30 focus:border-cyan-400"
                  }
                `}
              />
              {emailError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 ml-1"
                >
                  Please enter your email address
                </motion.p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-cyan-200 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                className={`
                  w-full px-4 py-3 rounded-xl bg-gray-800/50 
                  border-2 transition-all duration-200 outline-none
                  text-white placeholder-gray-400
                  focus:ring-2 focus:ring-cyan-400
                  ${passwordError 
                    ? "border-red-400 focus:border-red-400" 
                    : "border-cyan-500/30 focus:border-cyan-400"
                  }
                `}
              />
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 ml-1"
                >
                  Please enter your password
                </motion.p>
              )}
            </motion.div>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={login}
              disabled={isDisabled}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-white
                transition-all duration-200 transform
                ${isDisabled 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 hover:from-cyan-400 hover:via-blue-400 hover:to-violet-400 hover:scale-[1.02] active:scale-[0.97] shadow-lg hover:shadow-cyan-500/25"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center text-cyan-200/50 text-sm mt-6"
            >
              Your memories are safe with us
            </motion.p>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
