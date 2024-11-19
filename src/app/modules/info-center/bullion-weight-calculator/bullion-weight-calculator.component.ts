import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetalType } from 'src/app/enum/metal-type';
import { ProductService } from 'src/app/shared/services/modules/product.service';
import { Product } from '../../product/models/product.model';
import { CategoryService } from 'src/app/shared/services/modules/category.service';
import { Category } from '../../product/models/category';

@Component({
  selector: 'app-bullion-weight-calculator',
  templateUrl: './bullion-weight-calculator.component.html',
  styleUrls: ['./bullion-weight-calculator.component.scss'],
})
export class BullionWeightCalculatorComponent {
  public form: FormGroup;
  public productId: number = 0;
  public product: Product = {} as Product;
  public selectedAlloy: any = 'all';
  public categories: Category[] = [];
  public bullionSubcategoriesNames: string[] = [];
  public alloys: any[] = [];
  public alloy: any;
  public alloyOptions = ['Option 1', 'Option 2', 'Option 3']; // Replace these options with your alloy choices
  public metalTypes: any[] = [];
  public selectedMetalType: string = 'all';
  public alloyId: any;
  public groupedProducts: any[] = [];
  public tableData: any[] = [];
  public originalTableData: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      const productId = +params['productId']; // Convert to a number
      const refcode = params['refcode'];
      // Now you can use productId and refcode in your components
    });
    this.form = this.formBuilder.group({
      type: '',
      alloy: '',
      lengthValue: 0,
      lengthUnit: '1',
      gaugeUnit: '1',
      widthUnit: '1',
      width: 0,
      gauge: 0,
      weight: 0,
    });

    this.form.valueChanges.subscribe(() => {
      this.calculateWeight();
    });
  }

  isDShapeWireOrSheetSelected(): boolean {
    const selectedType = this.form.get('type')?.value;
    return selectedType === 'D-Shape Wire' || selectedType === 'Sheet';
  }

  ngOnInit(): void {
    this.getCategories();
    this.getAllAlloys();
    this.fetchMetalTypes();
    this.filterTable(this.alloyId);
    this.productId = +this.route.snapshot.paramMap.get('productId')!;
    const selectedAlloy = this.form.get('alloy')?.value;
    // Fetch the product details using the ProductService
    this.productService.getProductById(this.productId).subscribe((product) => {
      if (product) {
        this.product = product;
      } else {}
    });
    this.productService
      .getProductById(this.productId)
      .subscribe((data: any) => {
        this.originalTableData = data.alloys;
        this.tableData = [data];
      });
  }

  getCategories() {
    this.categoryService.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
        // Find the Bullion category
        const bullionCategory = this.categories.find(
          (category) => category.categoryName === 'Bullion'
        );
        if (bullionCategory && bullionCategory.subcategories) {
          // Extract only the names from the subcategories
          this.bullionSubcategoriesNames = bullionCategory.subcategories.map(
            (subcategory) => subcategory.subcategoryName
          );
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getAllAlloys() {
    this.productService.getAllAlloys().subscribe(
      (data: any[]) => {
        this.alloys = data.map((alloy) => alloy.stockDescription);
      },
      (error) => {
        console.error('Error fetching alloys:', error);
      }
    );
  }

  fetchMetalTypes() {
    this.productService.getAllAlloys().subscribe(
      (data: MetalType[]) => {
        this.metalTypes = data;
      },
      (error) => {
        console.error('Error fetching metal types', error);
      }
    );
  }

  filterTable(MetalType: any) {
    this.productService.getProductsByAlloyId(MetalType).subscribe(
      (response: any) => {
        this.groupedProducts = response;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
    this.calculateWeight();
  }

  calculateWeight() {
    const lengthValue = this.form.get('lengthValue')?.value;
    const width = this.form.get('width')?.value;
    const gauge = this.form.get('gauge')?.value;
    const selectedType = this.form.get('type')?.value;
    const selectedAlloy = this.form.get('alloy')?.value;
    const lengthUnit = this.form.get('lengthUnit')?.value;
    const widthUnit = this.form.get('widthUnit')?.value;
    const gaugeUnit = this.form.get('gaugeUnit')?.value;

    const lengthMultiplier = this.getConversionMultiplier(lengthUnit);
    const widthMultiplier = this.getConversionMultiplier(widthUnit);
    const gaugeMultiplier = this.getConversionMultiplier(gaugeUnit);

    const convertedLength = lengthValue * lengthMultiplier;
    const convertedWidth = width * widthMultiplier;
    const convertedGauge = gauge * gaugeMultiplier;

    const densityValues: any = {
      '18ct White': 16.2,
      '18ct Yellow': 15.5,
      Platinum: 20.1,
      '9ct Red': 11.1,
      Silver: 10.3,
      '22ct Yellow': 17.8,
      '14ct Yellow': 13,
      '9ct Yellow gold': 11.2,
      '9ct White': 11.9,
      '18ct White Setting': 17.4,
      '18ct Red': 15.2,
      '18ct Red Single St': 15.1,
      '22ct Yellow Offcuts': 17.7,
      '18ct White Claws Yellow Bezel': 15.5,
      '18ct Yellow Omega Ear Clips': 15.7,
      '18ct Yellow and White': 16.2,
      '18ct W': 16.2,
    };

    const density = densityValues[selectedAlloy];

    let weightInGrams = 0;

    switch (selectedType) {
      case 'Sheet':
        weightInGrams =
          convertedGauge * convertedLength * convertedWidth * density;
        break;
      case 'Square Wire':
        weightInGrams = convertedLength * Math.pow(convertedGauge, 2) * density;
        break;
      case 'Round Wire':
        weightInGrams =
          3.14 * Math.pow(convertedGauge / 2, 2) * convertedLength * density;
        break;
      case 'D-Shape Wire':
        weightInGrams =
          convertedWidth * convertedGauge * 0.85 * density * convertedLength;
        break;
      default:
        weightInGrams = convertedGauge * convertedLength;
        break;
    }

    const weightWithTwoDecimals = weightInGrams.toFixed(2);
    const weightDisplay = `${weightWithTwoDecimals} grams`;
    this.form.patchValue({ weight: weightDisplay });
  }

  getConversionMultiplier(unit: string | null): number {
    // Get the data-conversion attribute value from the selected option
    const selectedOption = document.querySelector(`[value="${unit}"]`);
    const conversionFactor = selectedOption?.getAttribute('data-conversion');
    return conversionFactor ? parseFloat(conversionFactor) : 1;
  }
}
