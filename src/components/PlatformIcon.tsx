import React from 'react';

import facebookIcon from '../assets/facebook.png';
import tikTokIcon from '../assets/tik-tok.png';
import bancoPichincaIcon from '../assets/Banco-Pichincha.png';
import bancoGuayaquilIcon from '../assets/bancoGuayaquil.png';
import instagramIcon from '../assets/instagram.png';
import youtubeIcon from '../assets/youtube.png';
import linkedinIcon from '../assets/linkedin.png';

interface PlatformIconProps {
    platformName: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const platformConfig = {
    facebook: { 
        icon: facebookIcon, 
        bgColor: 'bg-blue-600',
        shape: 'rounded-full' 
    },
    instagram: { 
        icon: instagramIcon, 
        bgColor: 'bg-gradient-to-br from-purple-600 to-pink-500',
        shape: 'rounded-2xl' 
    },
    tiktok: { 
        icon: tikTokIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    bancodepichincha: { 
        icon: bancoPichincaIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    bancopichincha: { 
        icon: bancoPichincaIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    bancodeguayaquil: { 
        icon: bancoGuayaquilIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    bancoguayaquil: { 
        icon: bancoGuayaquilIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    youtube: { 
        icon: youtubeIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    linkedin: { 
        icon: linkedinIcon, 
        bgColor: 'bg-sky-500',
        shape: 'rounded-full' 
    },
    
} as const;

const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 'w-5 h-5' },
    md: { container: 'w-12 h-12', icon: 'w-8 h-8' },
    lg: { container: 'w-16 h-16', icon: 'w-10 h-10' }
};

const PlatformIcon: React.FC<PlatformIconProps> = ({ 
    platformName, 
    size = 'lg', 
    className = '' 
}) => {
    const name = platformName.toLowerCase().replace(/\s/g, '');

    
    // Buscar la plataforma en el nombre
    const platformKey = Object.keys(platformConfig).find(platform => 
        name.includes(platform)
    ) as keyof typeof platformConfig;

    const { container, icon } = sizeClasses[size];

    if (platformKey) {
        const { icon: iconSrc, bgColor, shape } = platformConfig[platformKey];
        
        return (
            <div className={`${container} ${bgColor} ${shape} flex items-center justify-center ${className}`}>
                <img 
                    src={iconSrc} 
                    alt={platformKey} 
                    className={`${icon} object-contain`}
                />
            </div>
        );
    }

    // Fallback para plataformas no encontradas
    return (
        <div className={`${container} bg-gray-500 rounded-full flex items-center justify-center ${className}`}>
            <span className="text-white text-sm font-bold">?</span>
        </div>
    );
};

export default PlatformIcon;