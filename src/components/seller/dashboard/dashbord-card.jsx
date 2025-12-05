import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardCard = ({ title, value }) => {
  return (
    <Card className='rounded-2xl shadow-sm transition-shadow hover:shadow-md'>
      <CardHeader className='pb-2'>
        <CardTitle>
          <h3 className='text-base font-bold'>{title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
};
