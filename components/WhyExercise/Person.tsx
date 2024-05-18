interface Props {
  name: string;
  photo: string | null;
}

const placeholder = "/images/why-exercise/placeholder.png";

export default function Person({ name, photo }: Props) {
  const backgroundImage = photo || placeholder;

  return (
    <div className="person">
      <div className="photo" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <div className="name">
        <span>{name}</span>
      </div>
    </div>
  );
}
