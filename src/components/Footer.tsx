
import React from "react";
import { Cpu, Heart } from "lucide-react";


const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-tech-purple to-tech-blue p-6 text-white mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Cpu className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">Revamp AI PC Builder</span>
            </div>
            <p className="text-white/80 max-w-xs">
              Transform your PC building experience with AI-powered recommendations tailored to your needs and budget.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Builds</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Parts</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Guides</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="text-sm">© 2025 Revamp AI PC Builder</span>
          </div>
          <div className="flex items-center text-sm mt-4 md:mt-0">
            <Heart className="w-4 h-4 mr-1 text-red-300" />
            <span>Made with Revamp AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
