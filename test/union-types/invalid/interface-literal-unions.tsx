// Invalid: Interface properties with literal unions

interface InvalidInterface {
  status: 'pending' | 'success' | 'error';
  mode: 'light' | 'dark';
  priority: 'low' | 'medium' | 'high';
  theme: 'default' | 'minimal' | 'colorful';
}

type InvalidType = {
  category: 'urgent' | 'normal' | 'low';
  size: 'small' | 'medium' | 'large';
};

export { InvalidInterface, InvalidType };