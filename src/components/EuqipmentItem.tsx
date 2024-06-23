const EquipmentItem: React.FC<{
  icon: React.ReactNode;
  name: string;
  value: string;
}> = ({ icon, name, value }) => (
  <div className='flex items-center space-x-2'>
    {icon}
    <div>
      <p className='text-sm font-semibold'>{name}</p>
      <p className='text-xs text-gray-400'>{value}</p>
    </div>
  </div>
);

export default EquipmentItem;
