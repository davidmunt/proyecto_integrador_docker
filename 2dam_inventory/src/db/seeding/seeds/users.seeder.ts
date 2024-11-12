import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../../../data/inventory_users';
import { User } from '../../../users/users.entity';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const userEntries = userData.map((item) => {
      const userEntry = new User();
      userEntry.name = item.name;
      userEntry.surname = item.surname;
      userEntry.password = item.password;
      userEntry.email = item.email;
      userEntry.role = item.role;

      return userEntry;
    });

    await userRepository.save(userEntries);

    console.log('Users seeding completed!');
  }
}
