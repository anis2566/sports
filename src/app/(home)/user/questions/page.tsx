import { Metadata } from 'next';

import { QuestionList } from '@/features/home/user/questions/components/question-list';

export const metadata: Metadata = {
    title: "TomarSports | Questions",
    description: "Questions page.",
};

const Questions = () => {
    return <QuestionList />
}

export default Questions