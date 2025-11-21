import React from 'react'
import { motion } from "motion/react";
import {cn} from '@/utils/cn'

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const Card = ({children, className, animate, delay}:CardProps) => {
  const content = (
    <div className={cn("card group", className)}>
      <div className="tech-grid" />
      <div className="relative">
        {children}
      </div>
    </div>
  );
  if(!animate){
    return content
  }
  return (
    <motion.div
      initial={{opacity: 0, y:20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay}}
    >
      {content}
    </motion.div>
  )
}

export default Card
