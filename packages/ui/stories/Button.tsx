import { styled } from "stiches";

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const SButton = styled("button", {
  fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontWeight: 700,
  border: 0,
  borderRadius: "3em",
  cursor: "pointer",
  display: "inline-block",
  lineHeight: 1,
  variants: {
    primary: {
      true: {
        color: "white",
        backgroundColor: "#1ea7fd",
      },
      false: {
        color: "#333",
        backgroundColor: "transparent",
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset",
      },
    },
    small: {
      true: {
        fontSize: "12px",
        padding: "10px 16px",
      },
    },
    medium: {
      true: {
        fontSize: "14px",
        padding: "11px 20px",
      },
    },
    large: {
      true: {
        fontSize: "16px",
        padding: "12px 24px",
      },
    },
  },
});

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  return (
    <SButton
      type="button"
      primary={primary}
      style={{ backgroundColor }}
      small={size === 'small'}
      medium={size === 'medium'}
      large={size === 'large'}
      {...props}
    >
      {label}
    </SButton>
  );
};
