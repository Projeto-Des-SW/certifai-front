import './styles.css';
import illustration from '../../assets/images/certifai.png';
import google from '../../assets/images/google-logo.png';
import { useLoginController } from './indexController.tsx';

const Login = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
        handleRegisterClick,
        handleGoogleLogin,
        handleForgotPasswordClick
    } = useLoginController();

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-illustration">
                    <img src={illustration} alt="Ilustração da logo do CertifAI" />
                    <h1 className="login-brand-title">Certif<span>AI</span></h1>
                </div>                

                <div className="login-form-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">LOGIN</h2>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email do usuário"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                            />
                        </div>

                        <a 
                            href="#" 
                            className="forgot-password"
                            onClick={handleForgotPasswordClick}
                        >
                            Esqueceu a senha?
                        </a>

                        <div className="login-buttons-container">
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'ENTRANDO...' : 'LOGIN'}
                            </button>

                            <div className="divider-vertical">
                                <span>ou</span>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="google-login-button"
                                disabled={isLoading}>
                                <img
                                    src={google} 
                                    alt="Google logo"
                                    className="w-3 h-3"
                                />
                                <span className="text-sm font-medium text-gray-700">Login com Google</span>
                            </button>
                        </div>

                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        <div className="register-section">
                            <p className="register-text">Não tem uma conta?</p>
                            <button type="button" className="register-button" onClick={handleRegisterClick}>
                                REGISTRE-SE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;