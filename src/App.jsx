import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const AgeCalculator = () => {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: ''
  });
  
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [animatedAge, setAnimatedAge] = useState({ years: '--', months: '--', days: '--' });
  const [isAnimating, setIsAnimating] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const inputDate = new Date(
      parseInt(formData.year),
      parseInt(formData.month) - 1,
      parseInt(formData.day)
    );

    // Check for empty fields
    if (!formData.day) newErrors.day = 'This field is required';
    if (!formData.month) newErrors.month = 'This field is required';
    if (!formData.year) newErrors.year = 'This field is required';

    // Validate day
    if (formData.day) {
      const day = parseInt(formData.day);
      if (day < 1 || day > 31) {
        newErrors.day = 'Must be a valid day';
      }
    }

    // Validate month
    if (formData.month) {
      const month = parseInt(formData.month);
      if (month < 1 || month > 12) {
        newErrors.month = 'Must be a valid month';
      }
    }

    // Validate year
    if (formData.year) {
      const year = parseInt(formData.year);
      if (year > currentDate.getFullYear()) {
        newErrors.year = 'Must be in the past';
      }
    }

    // Validate date is real
    if (formData.day && formData.month && formData.year) {
      if (isNaN(inputDate.getTime())) {
        newErrors.day = 'Must be a valid date';
      } else if (inputDate > currentDate) {
        newErrors.day = 'Must be in the past';
      }

      // Check for invalid dates like 31/04/YYYY (April has 30 days)
      const lastDayOfMonth = new Date(
        parseInt(formData.year),
        parseInt(formData.month),
        0
      ).getDate();
      if (parseInt(formData.day) > lastDayOfMonth) {
        newErrors.day = 'Invalid date for this month';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = () => {
    const birthDate = new Date(
      parseInt(formData.year),
      parseInt(formData.month) - 1,
      parseInt(formData.day)
    );
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      days += lastMonth.getDate();
      months--;
    }

    return { years, months, days };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const calculatedAge = calculateAge();
      setAge(calculatedAge);
      setIsAnimating(true);
      setAnimatedAge({ years: 0, months: 0, days: 0 });
    }
  };

  useEffect(() => {
    if (isAnimating && age) {
      const animationDuration = 1000; // 1 second
      const steps = 20;
      const stepDuration = animationDuration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedAge({
          years: Math.round(age.years * progress),
          months: Math.round(age.months * progress),
          days: Math.round(age.days * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setIsAnimating(false);
          setAnimatedAge(age);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [isAnimating, age]);

  const inputClassName = (error) =>
    `w-full px-4 py-5 md:text-3xl text-lg font-bold rounded-lg border ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
    } focus:outline-none focus:ring-2`;

  return (
 <div className='bg-off-white min-h-screen flex items-center container mx-auto'>
     <div className="md:max-w-4xl max-w-xl min-h-full mx-auto p-16 bg-white rounded-3xl rounded-br-[150px] shadow-lg font-poppins">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          <div>
            <label
              className={`block text-lg font-bold tracking-widest mb-1 ${
                errors.day ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              DAY
            </label>
            <input
              type="number"
              placeholder="DD"
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              className={inputClassName(errors.day)}
            />
            {errors.day && (
              <div className="flex items-center mt-1 text-red-500 text-xs italic">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.day}
              </div>
            )}
          </div>
          <div>
            <label
              className={`block text-lg font-bold tracking-widest mb-1 ${
                errors.month ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              MONTH
            </label>
            <input
              type="number"
              placeholder="MM"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className={inputClassName(errors.month)}
            />
            {errors.month && (
              <div className="flex items-center mt-1 text-red-500 text-xs italic">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.month}
              </div>
            )}
          </div>
          <div>
            <label
              className={`block text-lg font-bold tracking-widest mb-1 ${
                errors.year ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              YEAR
            </label>
            <input
              type="number"
              placeholder="YYYY"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className={inputClassName(errors.year)}
            />
            {errors.year && (
              <div className="flex items-center mt-1 text-red-500 text-xs italic">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.year}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex md:justify-end justify-center">
            <button
              type="submit"
              className="bg-violet-purple hover:bg-purple-700 text-white rounded-full md:p-10 p-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
           <svg xmlns="http://www.w3.org/2000/svg" className='md:w-[52px] md:h-[46px] w-[46px] h-[40px]' viewBox="0 0 46 44"><g fill="none" stroke="#FFF" stroke-width="2"><path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"/></g></svg>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        <p className="md:text-8xl text-5xl font-extrabold italic">
          <span className="text-violet-purple">{animatedAge.years}</span> years
        </p>
        <p className="md:text-8xl text-5xl font-extrabold italic">
          <span className="text-violet-purple">{animatedAge.months}</span> months
        </p>
        <p className="md:text-8xl text-5xl font-extrabold italic">
          <span className="text-violet-purple">{animatedAge.days}</span> days
        </p>
      </div>
    </div>
 </div>
  );
};

export default AgeCalculator;