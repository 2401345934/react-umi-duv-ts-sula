import React from 'react';
import { CreateForm } from 'bssula';
import access from '@/components/access';

export default access((props: any) => {
  const config = {
    layout: 'horizontal',
    actionsPosition: 'bottom',
    ...props,
  };

  return (
    <div className="bssula-form">
      <CreateForm {...config} />
    </div>
  );
});
