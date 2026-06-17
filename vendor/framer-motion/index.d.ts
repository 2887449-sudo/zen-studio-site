import * as React from "react";

type MotionProps<T> = React.HTMLAttributes<T> & {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileInView?: any;
  viewport?: any;
  whileHover?: any;
  layout?: any;
};

type MotionFactory = {
  div: React.ForwardRefExoticComponent<MotionProps<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
  section: React.ForwardRefExoticComponent<MotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
  button: React.ForwardRefExoticComponent<MotionProps<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
  [key: string]: React.ForwardRefExoticComponent<any>;
};

export const motion: MotionFactory;
export function AnimatePresence(props: { children?: React.ReactNode; mode?: string }): React.ReactElement;
