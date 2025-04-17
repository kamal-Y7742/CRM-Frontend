import "../assets/CSS/Login.css";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaArrowLeft,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { HiKey } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginUser,
  setCredentials,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../features/auth/authSlice";
import AuthServices from "../Services/AuthServices";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authService = AuthServices;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  console.log(resetSuccess, "resetSuccess");
  const [resetError, setResetError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await dispatch(
        loginUser({ email, password, rememberMe })
      ).unwrap();
      dispatch(setCredentials(result));
      toast.success("Login successful! 🎉");

      switch (result.user.role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "manager":
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.message || "Login failed. Please try again.";
      setError(msg);
      // toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError("");

    try {
      if (resetStep === 1) {
        await dispatch(forgotPassword(resetEmail)).unwrap();
        toast.success("OTP sent to your email!");
        setResetStep(2);
      } else if (resetStep === 2) {
        const otpString = otp.join("");
        await dispatch(
          verifyOtp({ email: resetEmail, otp: otpString })
        ).unwrap();
        toast.success("OTP verified successfully!");
        setResetStep(3);
      } else if (resetStep === 3) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords don't match!");
        }
        const otpString = otp.join("");
        await dispatch(
          resetPassword({
            email: resetEmail,
            otp: otpString,
            newPassword,
          })
        ).unwrap();
        toast.success("Password reset successfully!");
        setResetSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetStep(1);
          setResetSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setResetError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetStep(1);
    setResetEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setResetSuccess(false);
    setResetError("");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/google`;
  };

  const handleSsoLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/sso`;
  };

  const renderPasswordResetContent = () => {
    if (resetSuccess) {
      return (
        <div className="reset-success">
          <div className="success-icon">✓</div>
          <h3>Password Reset Successful!</h3>
          <p>
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      );
    }

    switch (resetStep) {
      case 1:
        return (
          <>
            <h2 className="card-title">Forgot Password</h2>
            <p>Enter your email and we'll send you an OTP.</p>
            <form onSubmit={handleResetSubmit}>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="card-title">Enter OTP</h2>
            <form onSubmit={handleResetSubmit}>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    autoFocus={index === 0}
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                className="login-btn"
                disabled={otp.some((d) => d === "") || loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="resend-otp">
                Didn't receive it?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setResetStep(1);
                  }}
                >
                  Resend OTP
                </a>
              </p>
            </form>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="card-title">Reset Password</h2>
            <form onSubmit={handleResetSubmit}>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <div className="logo-container">
          <h3 style={{ fontWeight: "bolder" }}>CRM</h3>
        </div>
        <div className="try-free-container">
          <span className="user-prompt">Not a Pipedrive user?</span>
          <a href="#" className="try-free-btn">
            Try it free
          </a>
        </div>
      </div>

      <div className="login-container">
        <div className="card">
          {showForgotPassword ? (
            <div className="reset-password-container">
              <button className="back-button" onClick={handleBackToLogin}>
                <FaArrowLeft /> Back to Login
              </button>
              {renderPasswordResetContent()}
            </div>
          ) : (
            <>
              <h2 className="card-title">Log in</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <a
                    href="#"
                    className="forgot-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(true);
                      setResetEmail(email);
                    }}
                  >
                    Forgot?
                  </a>
                </div>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Log in"}
                </button>
                <div className="remember-me">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                </div>
              </form>

              <div className="divider">
                <span>or access quickly</span>
              </div>

              <div className="social-login">
                <button
                  className="social-btn google-btn"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <FaGoogle className="social-icon" />
                  <span>Google</span>
                </button>
                <button
                  className="social-btn sso-btn"
                  onClick={handleSsoLogin}
                  disabled={loading}
                >
                  <HiKey className="social-icon" />
                  <span>SSO</span>
                </button>
              </div>

              <div className="login-help">
                <a href="/register">Don't have an account?</a>
                <a href="/help">Having issues logging in?</a>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="language-selector">
          <select>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div className="copyright">
          © 2025 Pipedrive | <a href="#">Terms of Service</a> |{" "}
          <a href="#">Privacy Policy</a>
        </div>
        <div className="company-info">Pipedrive is a Web-based Sales CRM.</div>
        <div className="social-links">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
