import { MockData } from '../../types/mock-data.type.js';
import { getRandomItem } from '../../utils/random.js';
import { UserGeneratorInterface } from './user-generator.interface';

export default class UserGenerator implements UserGeneratorInterface {
    constructor(private readonly mockData: MockData) {}

    public generate(): string {
        const user = getRandomItem<string>(this.mockData.users);
        const email = getRandomItem<string>(this.mockData.emails);
        const avatarPath = getRandomItem<string>(this.mockData.avatars);

        const [firstname, lastname] = user.split(' ');

        return [email, avatarPath, firstname, lastname].join('\t');
    }
}
