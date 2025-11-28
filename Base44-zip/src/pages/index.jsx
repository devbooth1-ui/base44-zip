import Layout from "./Layout.jsx";

import Home from "./Home";

import Payment from "./Payment";

import Play from "./Play";

import Awards from "./Awards";

import Wallet from "./Wallet";

import Leaderboard from "./Leaderboard";

import PlayerVerify from "./PlayerVerify";

import TermsAndConditions from "./TermsAndConditions";

import MillionDollarTournament from "./MillionDollarTournament";

import ClaimsStatus from "./ClaimsStatus";

import AwardsInfo from "./AwardsInfo";

import TournamentDetails from "./TournamentDetails";

import CameraVerification from "./CameraVerification";

import VideoIntro from "./VideoIntro";

import PreGame from "./PreGame";

import AttireVerification from "./AttireVerification";

import AdminPlayers from "./AdminPlayers";

import AdminCRM from "./AdminCRM";

import AdminAccounting from "./AdminAccounting";

import HowItsPlayed from "./HowItsPlayed";

import CoursePaymentDashboard from "./CoursePaymentDashboard";

import Scorecard from "./Scorecard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Payment: Payment,
    
    Play: Play,
    
    Awards: Awards,
    
    Wallet: Wallet,
    
    Leaderboard: Leaderboard,
    
    PlayerVerify: PlayerVerify,
    
    TermsAndConditions: TermsAndConditions,
    
    MillionDollarTournament: MillionDollarTournament,
    
    ClaimsStatus: ClaimsStatus,
    
    AwardsInfo: AwardsInfo,
    
    TournamentDetails: TournamentDetails,
    
    CameraVerification: CameraVerification,
    
    VideoIntro: VideoIntro,
    
    PreGame: PreGame,
    
    AttireVerification: AttireVerification,
    
    AdminPlayers: AdminPlayers,
    
    AdminCRM: AdminCRM,
    
    AdminAccounting: AdminAccounting,
    
    HowItsPlayed: HowItsPlayed,
    
    CoursePaymentDashboard: CoursePaymentDashboard,
    
    Scorecard: Scorecard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Payment" element={<Payment />} />
                
                <Route path="/Play" element={<Play />} />
                
                <Route path="/Awards" element={<Awards />} />
                
                <Route path="/Wallet" element={<Wallet />} />
                
                <Route path="/Leaderboard" element={<Leaderboard />} />
                
                <Route path="/PlayerVerify" element={<PlayerVerify />} />
                
                <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
                
                <Route path="/MillionDollarTournament" element={<MillionDollarTournament />} />
                
                <Route path="/ClaimsStatus" element={<ClaimsStatus />} />
                
                <Route path="/AwardsInfo" element={<AwardsInfo />} />
                
                <Route path="/TournamentDetails" element={<TournamentDetails />} />
                
                <Route path="/CameraVerification" element={<CameraVerification />} />
                
                <Route path="/VideoIntro" element={<VideoIntro />} />
                
                <Route path="/PreGame" element={<PreGame />} />
                
                <Route path="/AttireVerification" element={<AttireVerification />} />
                
                <Route path="/AdminPlayers" element={<AdminPlayers />} />
                
                <Route path="/AdminCRM" element={<AdminCRM />} />
                
                <Route path="/AdminAccounting" element={<AdminAccounting />} />
                
                <Route path="/HowItsPlayed" element={<HowItsPlayed />} />
                
                <Route path="/CoursePaymentDashboard" element={<CoursePaymentDashboard />} />
                
                <Route path="/Scorecard" element={<Scorecard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}