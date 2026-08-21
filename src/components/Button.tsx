import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '../lib/animations';

interface ButtonProps {
    ctaText?: string;
    ctaURL?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning';
    fullWidth?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

const Button = ({
    ctaText,
    ctaURL,
    variant = 'primary',
    fullWidth = false,
    onClick,
    disabled = false,
    type = 'button',
    icon,
    iconPosition = 'left',
    className = ''
}: ButtonProps) => {
    const baseStyles = "p-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors";
    const widthStyles = fullWidth ? "w-full" : "w-full md:w-60";
    
    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
        secondary: "bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300",
        outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-yellow-300",
    };

    const buttonClasses = `${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className}`;

    const buttonContent = (
        <motion.button 
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            type={type}
            variants={buttonHoverVariants}
            initial="rest"
            whileHover={!disabled ? "hover" : "rest"}
            whileTap={!disabled ? "tap" : "rest"}
        >
            {icon && iconPosition === 'left' && icon}
            {ctaText}
            {icon && iconPosition === 'right' && icon}
        </motion.button>
    );

    if (ctaURL) {
        return <Link to={ctaURL}>{buttonContent}</Link>;
    }

    return buttonContent;
};

export default Button;
