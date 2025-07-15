import React, { useState } from 'react';
import { Lock, Play, ChevronRight, Key, Archive, Heart, Settings, Facebook, Instagram } from 'lucide-react';

import GeneratePassBut from '../components/GeneratePassBut';
import StorageBut from '../components/StorageBut';

function Home(){


    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm overflow-hidden">
                <div className="bg-white px-6 py-4">
                    <div className="text-sm text-gray-500 mb-6">Home Screen</div>
                    
                    {/* Lock Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>

                        {/* Location */}
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-600 text-sm">Guayaquil, Ecuador</span>
                    </div>
                    
                    {/* Welcome Message */}
                    <div className="text-center mb-6">
                        <p className="text-gray-800 font-medium mb-1">BIENVENIDO</p>
                        <p className="text-green-500 text-xl font-semibold">Michael Poveda</p>
                    </div>

                    {/* Generate Password Button */}
                    <GeneratePassBut/>
                    
                    {/* Storage Button */}
                    <StorageBut />
                    
                </div>
            </div>
        </div>
    );
}

export default Home;