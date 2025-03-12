import React from 'react';
import clsx from 'clsx';

interface CTAButtonProps {
    text: string;
    url: string;
    variant?: 'primary' | 'secondary';
}

const CTAButton: React.FC<CTAButtonProps> = ({ text, url, variant = 'primary' }) => {
    return (
        <a href={url}>
            <button
                type="button"
                className={clsx(
                    "flex items-center justify-center px-5 py-3 rounded-lg text-m font-medium transition-all duration-300",
                    {
                        "bg-foreground text-white hover:bg-opacity-90": variant === 'primary',
                        "bg-gray-100 text-foreground hover:bg-gray-200": variant === 'secondary',
                    }
                )}
            >
                {text}
            </button>
        </a>
    );
};

export default CTAButton;
