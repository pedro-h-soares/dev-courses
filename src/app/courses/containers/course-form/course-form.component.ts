import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      category: ['', Validators.required]
    });

  categories: string[] = [];

  constructor(private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue(course);
  }

  onSubmit() {
    if(this.form.valid) {
      this.service.save(this.form.value)
        .subscribe(result => this.onSuccess(), error => this.onError());
    }
    else {
      this.form.markAllAsTouched();
      console.log('Invalid form fields');
    }
  }

  onCancel() {
    this.router.navigate([''], {relativeTo: this.route})
  }

  private onSuccess() {
    var message = this.form.value._id=='' ? 'Curso salvo com sucesso.' : 'Edição realizada com sucesso.';
    this.snackBar.open(message, '', { duration: 3000});
    this.onCancel();
  }

  private onError(){
    this.snackBar.open("Erro ao salvar curso.", '', { duration: 3000 });
  }

}
