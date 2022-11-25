import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { WarningDialogComponent } from 'src/app/shared/components/warning-dialog/warning-dialog.component';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, Observable, of } from 'rxjs';

import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})

export class CoursesComponent {

  courses$: Observable<Course[]> = of([]);
  displayedColumns = ['name', 'category', 'actions'];


  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
      this.tableRefresh();
  }

  tableRefresh(){
    this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error => {
          console.log(error);
          this.onError('Erro carregar cursos.');
          return of([]);
        })
      );
  }

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], {relativeTo: this.route});
  }

  onDelete(course: Course) {
    this.onWarning(`Tem certeza que deseja excluir o curso ${course.name}`)
      .afterClosed().subscribe(result => {
        result && this.coursesService.remove(course._id).subscribe(() => this.tableRefresh());
      });
  }

  onWarning(errorMsg: string): MatDialogRef<WarningDialogComponent> {
    return this.dialog.open(WarningDialogComponent, {
      data: errorMsg
    });
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }



}
