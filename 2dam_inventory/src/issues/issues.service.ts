import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Issue } from './issues.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IssuesService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
  ) {}

  async getAllIssues(xml?: string): Promise<Issue[] | string> {
    const allIssues = await this.issueRepository.find({
      relations: ['user', 'technician', 'status', 'fk_inventari'],
    });
    if (xml == 'true') {
      const jsonForXml = JSON.stringify({
        Issues: allIssues,
      });
      const xmlResult = this.UtilsService.convertJSONtoXML(jsonForXml);
      return xmlResult;
    } else {
      return allIssues;
    }
  }

  async createIssue(Issue: any): Promise<Issue[]> {
    const newIssue = this.issueRepository.create(Issue);
    return this.issueRepository.save(newIssue);
  }

  async getIssue(id: number, xml?: string): Promise<Issue | string | null> {
    const issue = await this.issueRepository.findOneBy({ id_issue: id });
    if (issue != null) {
      if (xml === 'true') {
        const jsonForXml = JSON.stringify(issue);
        return this.UtilsService.convertJSONtoXML(jsonForXml);
      } else {
        return issue;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateIssue(id: number, Issue: Issue): Promise<Issue> {
    const existingIssue = await this.issueRepository.findOneBy({
      id_issue: id,
    });
    if (!existingIssue) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }
    await this.issueRepository.update(id, Issue);
    return await this.issueRepository.findOneBy({ id_issue: id });
  }

  async deleteIssue(id: number): Promise<void> {
    await this.issueRepository.delete(id);
  }
}
