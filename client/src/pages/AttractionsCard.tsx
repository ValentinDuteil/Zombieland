import type { Attraction } from "@/types";

type AttractionCardProps = Attraction

const AttractionCard = (props: AttractionCardProps) => {
    return (
        <div>
            <h3>{props.name}</h3>
            <p>{props.description}</p>
        </div>
    );
};

export default AttractionCard;