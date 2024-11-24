// components/DynamicIcon.jsx
import React, { Suspense, lazy } from 'react';
import { Utensils } from 'lucide-react'; // Fallback icon

const DynamicIcon = ({ iconName, ...props }) => {
  // Lazy load the icon component
  const IconComponent = lazy(() =>
    import('lucide-react').then((module) => {
      if (module[iconName]) {
        return { default: module[iconName] };
      } else {
        // If the icon doesn't exist, fallback to a default icon
        console.warn(`Icon "${iconName}" does not exist in lucide-react`);
        return { default: Utensils };
      }
    })
  );

  return (
    <Suspense fallback={<Utensils {...props} />}>
      <IconComponent {...props} />
    </Suspense>
  );
};

export default DynamicIcon;
