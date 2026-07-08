import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    }

    if (currentHour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };

  const getFirstName = () => {
    if (!user) return null;

    if (user.firstName) {
      return user.firstName;
    }

    if (user.name) {
      return user.name.split(" ")[0];
    }

    if (user.username) {
      return user.username;
    }

    return null;
  };

  const firstName = getFirstName();

  return (
    <section
      className="card p-6 flex flex-col justify-center"
      aria-label="Welcome message"
    >
      <h1 className="text-2xl md:text-3xl font-semibold mb-3">
        {firstName
          ? `${getGreeting()}, ${firstName}`
          : "Welcome Back"}
      </h1>

      <p className="text-gray-600 leading-relaxed">
        Here's an overview of your health today. Stay on top of
        your medications and health records with MediSync.
      </p>
    </section>
  );
}