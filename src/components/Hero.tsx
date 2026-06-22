
import React from 'react';
import { Cpu, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Logo from './Logo';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-tech from-tech-gradient-from to-tech-gradient-to">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Build Your Dream PC with
            <span className="text-tech-accent"> Smart Power</span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Our intelligent system helps you create the perfect custom PC build
            that matches your needs and budget perfectly.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="lg"
              className="bg-tech-accent hover:bg-tech-accent/90 text-white rounded-full px-8"
            >
              Start Building <ArrowRight className="ml-2" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Smart Selection",
                description: "Smart component recommendations based on your requirements"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Optimization",
                description: "Real-time performance analysis and compatibility checks"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Reliable Builds",
                description: "Thoroughly tested component combinations for stability"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * (index + 2) }}
                className="glass-effect backdrop-blur-md rounded-xl p-8 hover:bg-white/30 transition-all"
              >
                <div className="text-tech-accent mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
