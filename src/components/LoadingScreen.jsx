import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white-500"></div>
        </div>
    )
}

export default LoadingScreen
