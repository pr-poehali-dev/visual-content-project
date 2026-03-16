import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
          <h1 className="text-4xl font-bold mb-2">Админка</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center py-8">Нет доступных функций</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
