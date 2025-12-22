import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, title, action }) => {
    return (
        <div className={clsx('card', className)}>
            {(title || action) && (
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    {title && <h3 className="text-lg font-bold">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
