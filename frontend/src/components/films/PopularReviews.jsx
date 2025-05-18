export default function PopularReviews() {
  return (
    <div>
      <main>
        {/* top title bar */}
        <div className="flex justify-between opacity-70">
          <h1 className="text-md uppercase font-bold">
            Popular reviews this week
          </h1>
          <h1 className="text-sm cursor-pointer hover:text-accent">more</h1>
        </div>

        {/* divider */}
        <hr className="opacity-20" />
      </main>
    </div>
  );
}
