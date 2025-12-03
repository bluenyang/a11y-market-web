// components/A11y/A11ySettingRow.jsx

export default function A11ySettingRow({ label, control }) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-sm font-medium'>{label}</span>
      {control}
    </div>
  );
}
