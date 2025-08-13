export default function SectionHeader({ title, buttonText }: { title: string; buttonText?: string }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {buttonText && (
        <a href="#" className="text-orange-500 hover:underline">{buttonText}</a>
      )}
    </div>
  );
}
