import { ChallengeDto } from '@dtos/challanges/challenge.dto';
import { CreateChallengeDto } from '@dtos/challanges/create_challange.dto';
import { UpdateChallengeDto } from '@dtos/challanges/update_challenge.dto';
import { Challenge } from '@interfaces/challange.interface';
import AuthService from '@services/auth.service';
import ChallengesService from '@services/challenges.service';
import { NextFunction, Request, Response } from 'express';

class CoursesController {
  _challengesService = new ChallengesService();
  _authService = new AuthService();

  public getChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorId = req.query.authorId ? String(req.query.authorId) : null;
      const challenges: ChallengeDto[] = await this._challengesService.getChallenges(authorId);

      res.status(200).json({ data: challenges });
    } catch (error) {
      next(error);
    }
  };

  public getChallengeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = req.params.id;
      const challenge: ChallengeDto = await this._challengesService.getChallengeById(challengeId);

      res.status(200).json({ ...challenge });
    } catch (error) {
      next(error);
    }
  };

  public createChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeDto: CreateChallengeDto = req.body;
      const { tokenSubject } = await this._authService.getClaims(req);
      const challenge: Challenge = await this._challengesService.createChallenge(tokenSubject, challengeDto);

      res.status(201).json({ ...challenge });
    } catch (error) {
      next(error);
    }
  };

  public updateChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeDto: UpdateChallengeDto = req.body;
      const challengeId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const challenge: Challenge = await this._challengesService.updateChallenge(challengeId, challengeDto, tokenSubject);

      res.status(201).json({ ...challenge });
    } catch (error) {
      next(error);
    }
  };

  public deleteChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const challenge: Challenge = await this._challengesService.deleteChallenge(challengeId, tokenSubject);

      res.status(200).json({ ...challenge });
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
