"use client";

const React = require("react");

function normalizeStyle(props) {
  const style = { ...(props.style || {}) };
  const initial = props.initial && typeof props.initial === "object" && !Array.isArray(props.initial) ? props.initial : {};
  const animate = props.animate && typeof props.animate === "object" && !Array.isArray(props.animate) ? props.animate : {};
  const whileInView = props.whileInView && typeof props.whileInView === "object" && !Array.isArray(props.whileInView) ? props.whileInView : {};
  const target = Object.keys(animate).length ? animate : Object.keys(whileInView).length ? whileInView : initial;

  if (typeof target.opacity === "number") style.opacity = target.opacity;
  if (typeof target.y === "number" || typeof target.scale === "number") {
    const y = typeof target.y === "number" ? `${target.y}px` : "0";
    const scale = typeof target.scale === "number" ? target.scale : 1;
    style.transform = `translateY(${y}) scale(${scale})`;
  }
  const delay = props.transition && typeof props.transition.delay === "number" ? props.transition.delay : 0;
  style.transition = style.transition || `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
  return style;
}

function createMotionElement(tag) {
  return React.forwardRef(function MotionElement(props, ref) {
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileInView,
      viewport,
      whileHover,
      layout,
      ...rest
    } = props;
    return React.createElement(tag, { ...rest, ref, style: normalizeStyle(props) });
  });
}

const motion = new Proxy(
  {},
  {
    get(_target, tag) {
      return createMotionElement(tag);
    }
  }
);

function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

module.exports = { motion, AnimatePresence };
