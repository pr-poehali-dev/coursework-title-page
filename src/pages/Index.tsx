import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';

interface TitlePageData {
  university: string;
  faculty: string;
  department: string;
  workType: string;
  discipline: string;
  theme: string;
  studentName: string;
  studentGroup: string;
  teacherName: string;
  teacherPosition: string;
  city: string;
  year: string;
}

const Index = () => {
  const currentYear = new Date().getFullYear().toString();
  
  const [data, setData] = useState<TitlePageData>({
    university: 'ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ ВЫСШЕГО ОБРАЗОВАНИЯ',
    faculty: 'Факультет информационных технологий',
    department: 'Кафедра программной инженерии',
    workType: 'КУРСОВАЯ РАБОТА',
    discipline: 'по дисциплине «Разработка веб-приложений»',
    theme: 'Создание системы управления проектами',
    studentName: 'Иванов Иван Иванович',
    studentGroup: 'ИТ-301',
    teacherName: 'Петров Петр Петрович',
    teacherPosition: 'к.т.н., доцент',
    city: 'Москва',
    year: currentYear,
  });

  const handleChange = (field: keyof TitlePageData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Титульный лист</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Open Sans', sans-serif;
              width: 210mm;
              height: 297mm;
              padding: 20mm 25mm 20mm 30mm;
              background: white;
            }
            .page {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .top { text-align: center; }
            .university { 
              font-size: 12pt;
              font-weight: 600;
              text-transform: uppercase;
              margin-bottom: 8pt;
              line-height: 1.3;
            }
            .faculty, .department { 
              font-size: 13pt;
              margin-bottom: 4pt;
            }
            .middle {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 40pt 0;
            }
            .work-type {
              font-family: 'Montserrat', sans-serif;
              font-size: 18pt;
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 8pt;
            }
            .discipline {
              font-size: 14pt;
              margin-bottom: 24pt;
            }
            .theme-label {
              font-size: 13pt;
              margin-bottom: 8pt;
            }
            .theme {
              font-size: 15pt;
              font-weight: 600;
              line-height: 1.4;
              max-width: 450pt;
            }
            .bottom {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .student, .teacher {
              font-size: 13pt;
              line-height: 1.6;
            }
            .label {
              color: #666;
              font-size: 11pt;
            }
            .city-year {
              text-align: center;
              font-size: 13pt;
              margin-top: 20pt;
            }
            @media print {
              body { margin: 0; }
              @page { size: A4; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="top">
              <div class="university">${data.university}</div>
              <div class="faculty">${data.faculty}</div>
              <div class="department">${data.department}</div>
            </div>
            
            <div class="middle">
              <div class="work-type">${data.workType}</div>
              <div class="discipline">${data.discipline}</div>
              <div class="theme-label">на тему:</div>
              <div class="theme">«${data.theme}»</div>
            </div>
            
            <div>
              <div class="bottom">
                <div class="student">
                  <div class="label">Выполнил студент группы ${data.studentGroup}</div>
                  <div><strong>${data.studentName}</strong></div>
                </div>
                <div class="teacher">
                  <div class="label">Научный руководитель</div>
                  <div><strong>${data.teacherPosition}</strong></div>
                  <div><strong>${data.teacherName}</strong></div>
                </div>
              </div>
              <div class="city-year">
                <div>${data.city}</div>
                <div>${data.year}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">
            Генератор титульных листов
          </h1>
          <p className="text-muted-foreground text-lg">
            Создайте профессиональную обложку для вашей работы
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="FileText" size={24} className="text-accent" />
              Данные работы
            </h2>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="university" className="text-sm font-medium">Образовательное учреждение</Label>
                <Textarea
                  id="university"
                  value={data.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  className="mt-1.5 min-h-[60px]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faculty" className="text-sm font-medium">Факультет</Label>
                  <Input
                    id="faculty"
                    value={data.faculty}
                    onChange={(e) => handleChange('faculty', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-medium">Кафедра</Label>
                  <Input
                    id="department"
                    value={data.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workType" className="text-sm font-medium">Тип работы</Label>
                  <Input
                    id="workType"
                    value={data.workType}
                    onChange={(e) => handleChange('workType', e.target.value)}
                    placeholder="Курсовая работа"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="discipline" className="text-sm font-medium">Дисциплина</Label>
                  <Input
                    id="discipline"
                    value={data.discipline}
                    onChange={(e) => handleChange('discipline', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="theme" className="text-sm font-medium">Тема работы</Label>
                <Textarea
                  id="theme"
                  value={data.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="mt-1.5 min-h-[60px]"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">СТУДЕНТ</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName" className="text-sm font-medium">ФИО студента</Label>
                    <Input
                      id="studentName"
                      value={data.studentName}
                      onChange={(e) => handleChange('studentName', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentGroup" className="text-sm font-medium">Группа</Label>
                    <Input
                      id="studentGroup"
                      value={data.studentGroup}
                      onChange={(e) => handleChange('studentGroup', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">РУКОВОДИТЕЛЬ</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teacherName" className="text-sm font-medium">ФИО преподавателя</Label>
                    <Input
                      id="teacherName"
                      value={data.teacherName}
                      onChange={(e) => handleChange('teacherName', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherPosition" className="text-sm font-medium">Должность</Label>
                    <Input
                      id="teacherPosition"
                      value={data.teacherPosition}
                      onChange={(e) => handleChange('teacherPosition', e.target.value)}
                      placeholder="к.т.н., доцент"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">Город</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">Год</Label>
                  <Input
                    id="year"
                    value={data.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="p-8 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon name="Eye" size={24} className="text-accent" />
                  Предварительный просмотр
                </h2>
              </div>

              <div className="bg-white border-2 border-slate-200 shadow-lg rounded-sm p-12 aspect-[1/1.414] overflow-hidden text-[8px] relative">
                <div className="h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="font-semibold uppercase mb-2 leading-tight">
                      {data.university}
                    </div>
                    <div className="mb-1">{data.faculty}</div>
                    <div>{data.department}</div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                    <div className="font-bold text-[12px] uppercase mb-2">
                      {data.workType}
                    </div>
                    <div className="mb-4 text-[9px]">{data.discipline}</div>
                    <div className="mb-2 text-[9px]">на тему:</div>
                    <div className="font-semibold text-[10px] leading-tight">
                      «{data.theme}»
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-4 text-[9px]">
                      <div className="text-left">
                        <div className="text-muted-foreground text-[8px] mb-0.5">
                          Выполнил студент группы {data.studentGroup}
                        </div>
                        <div className="font-semibold">{data.studentName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-[8px] mb-0.5">
                          Научный руководитель
                        </div>
                        <div className="font-semibold">{data.teacherPosition}</div>
                        <div className="font-semibold">{data.teacherName}</div>
                      </div>
                    </div>
                    <div className="text-center text-[9px]">
                      <div>{data.city}</div>
                      <div>{data.year}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={generatePDF}
                size="lg"
                className="w-full mt-6 text-base font-medium"
              >
                <Icon name="Download" size={20} className="mr-2" />
                Скачать PDF
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
