import { FaFacebook,FaInstagram  } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";

import { SocialIcon } from "./social-icon"

export const Socials = () => {
    return (
        <div className="hidden md:flex items-center">
            <SocialIcon icon={<FaFacebook color="#1877F2" />} href="https://www.facebook.com/profile.php?id=100000000000000" />
            <SocialIcon icon={<FaXTwitter color="#000000" />} href="https://www.twitter.com/profile.php?id=100000000000000" />
            <SocialIcon icon={<FaYoutube color="#FF0000" />} href="https://www.youtube.com/profile.php?id=100000000000000" />
            <SocialIcon icon={<FaInstagram color="#E4405F" />} href="https://www.instagram.com/profile.php?id=100000000000000" />
        </div>
    )
}