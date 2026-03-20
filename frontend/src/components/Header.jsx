import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const Header = ({ title, onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/20 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <h1 className="text-xl md:text-2xl font-light text-white tracking-wide truncate max-w-[150px] md:max-w-none">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Suchen..."
                        className="bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors w-64"
                    />
                </div>

                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <i className="fa-regular fa-bell text-xl"></i>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                </button>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogout}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="Profil" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-medium text-white group-hover:text-red-400 transition-colors">Abmelden <i className="fa-solid fa-right-from-bracket ml-1 text-xs"></i></p>
                        <p className="text-gray-400 text-xs text-left">{user?.name || 'Admin'} <span className="text-gray-500">({user?.role || 'Rolle'})</span></p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
